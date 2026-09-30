import { GoogleGenerativeAI, FunctionDeclaration } from '@google/generative-ai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || ''
);

// ============================================================
// LIMPIEZA DE ESQUEMAS MCP PARA GEMINI
// ============================================================
//
// Playwright MCP utiliza esquemas JSON Schema más completos.
// Gemini Function Calling utiliza un subconjunto del esquema.
//
// Esta función elimina propiedades que Gemini no acepta,
// manteniendo la estructura necesaria de cada herramienta.
// ============================================================

function limpiarSchemaParaGemini(schema: any): any {

    if (!schema || typeof schema !== 'object') {
        return schema;
    }

    // Crear una copia para no modificar el esquema original
    const limpio: any = {};

    for (const [key, value] of Object.entries(schema)) {

        // Propiedades de JSON Schema que Gemini puede rechazar
        if (
            key === 'additionalProperties' ||
            key === 'propertyNames' ||
            key === '$schema' ||
            key === '$id' ||
            key === '$defs' ||
            key === 'definitions' ||
            key === 'examples'
        ) {
            continue;
        }

        // Procesar objetos anidados
        if (
            value &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {

            limpio[key] =
                limpiarSchemaParaGemini(value);

        }

        // Procesar arrays
        else if (Array.isArray(value)) {

            limpio[key] = value.map(item => {

                if (
                    item &&
                    typeof item === 'object'
                ) {
                    return limpiarSchemaParaGemini(item);
                }

                return item;
            });

        }

        else {

            limpio[key] = value;

        }
    }

    return limpio;
}

// ============================================================
// FUNCIÓN DE REINTENTO
// Permite manejar errores temporales de la API de Gemini
// ============================================================

async function conReintento(
    fn: () => Promise<any>,
    maxRetries = 10
) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();

        } catch (error: any) {

            if (
                error.message?.includes('503') ||
                error.message?.includes('429')
            ) {

                console.log(
                    `   ⏳ Servidor de Google saturado ` +
                    `(Intento ${i + 1}/${maxRetries}). ` +
                    `Esperando 8 segundos para reintentar...`
                );

                await new Promise(
                    res => setTimeout(res, 8000)
                );

            } else {
                throw error;
            }
        }
    }

    throw new Error(
        'El servidor falló repetidamente después de múltiples intentos.'
    );
}


// ============================================================
// FUNCIÓN PRINCIPAL DE AUDITORÍA
// ============================================================

async function iniciarAuditoria() {

    // --------------------------------------------------------
    // 1. OBTENER EL ARCHIVO SDD
    // --------------------------------------------------------

    const archivoSpec = process.argv[2];

    if (!archivoSpec) {
        console.error(' Error: Debes proporcionar la ruta del archivo SDD.');
        console.error('Uso: npx tsx .\\orquestador_playwright.ts <ruta_al_archivo.md>');
        process.exit(1);
    }

    console.log(
        ` 1. Leyendo Documento SDD (${archivoSpec})...`
    );

    if (!fs.existsSync(archivoSpec)) {

        console.error(
            ` El archivo ${archivoSpec} no existe.`
        );

        process.exit(1);
    }

    const sddContent =
        fs.readFileSync(archivoSpec, 'utf-8');


    // --------------------------------------------------------
    // 2. CONECTAR CON PLAYWRIGHT MCP
    // --------------------------------------------------------

    console.log(
        ' 2. Conectando al servidor Playwright MCP...'
    );

    const transport = new StdioClientTransport({

        command: 'npx',

        args: [
            '-y',
            '@playwright/mcp',
            '--browser=chromium'
        ]
    });


    // Crear cliente MCP
    const mcpClient = new Client(

        {
            name: 'auditor-app',
            version: '1.0'
        },

        {
            capabilities: {}
        }
    );


    // Conectar con el servidor MCP
    await mcpClient.connect(transport);


    // --------------------------------------------------------
    // 3. DESCUBRIR HERRAMIENTAS DE PLAYWRIGHT MCP
    // --------------------------------------------------------

    const mcpTools =
        await mcpClient.listTools();

    console.log(
        ` Conectado. Herramientas encontradas: ` +
        `${mcpTools.tools.length}`
    );


    console.log(
        '\n Herramientas disponibles:'
    );

    mcpTools.tools.forEach(tool => {

        console.log(
            `   - ${tool.name}`
        );

    });


    // --------------------------------------------------------
    // 4. CONVERTIR LAS HERRAMIENTAS MCP
    //    AL FORMATO DE GEMINI
    // --------------------------------------------------------

    const herramientasGemini: FunctionDeclaration[] =
    mcpTools.tools.map(tool => {

        const schemaOriginal =
            tool.inputSchema as any;

        // Limpiar el esquema antes de enviarlo a Gemini
        const schema =
            limpiarSchemaParaGemini(schemaOriginal);

        return {

            name:
                tool.name.replace(/-/g, '_'),

            description:
                tool.description || '',

            parameters: {

                type:
                    schema.type?.toUpperCase() || 'OBJECT',

                properties:
                    schema.properties || {},

                required:
                    schema.required || []
            }
        };
    });


    // --------------------------------------------------------
    // 5. CONFIGURAR GEMINI
    // --------------------------------------------------------

    const model =
        genAI.getGenerativeModel({

            model: 'gemini-flash-lite-latest',

            tools: [
                {
                    functionDeclarations:
                        herramientasGemini
                }
            ]
        });


    console.log(
        '\n 3. Iniciando el Agente de IA (Gemini)...'
    );


    // --------------------------------------------------------
    // 6. CREAR EL CONTEXTO INICIAL
    //    CON EL SDD
    // --------------------------------------------------------

    let history: any[] = [

        {

            role: 'user',

            parts: [

                {
                    text:
                        `Eres un Agente Auditor Autónomo.

Sigue estrictamente este SDD:

------------------------------
INICIO DEL SDD
------------------------------

${sddContent}

------------------------------
FIN DEL SDD
------------------------------

Utiliza las herramientas de navegación disponibles para realizar las acciones indicadas en la especificación.

Cuando finalices todas las acciones:

1. Resume los pasos realizados.
2. Indica los resultados obtenidos.
3. Incluye los hallazgos relevantes.
4. Indica si la auditoría pudo completarse.
5. Genera un reporte detallado con tus conclusiones.
`
                }

            ]
        }

    ];


    // --------------------------------------------------------
    // 7. CICLO PRINCIPAL DEL AGENTE
    // --------------------------------------------------------

    let completado = false;

    let iteracion = 0;


    while (
        !completado &&
        iteracion < 40
    ) {

        iteracion++;

        console.log(
            `\n   [Gemini Pensando... Iteración ${iteracion}]`
        );


        let respuesta;


        // ----------------------------------------------------
        // 8. SOLICITAR RESPUESTA A GEMINI
        // ----------------------------------------------------

        try {

            respuesta =
                await conReintento(

                    () =>
                        model.generateContent({
                            contents: history
                        })

                );

        } catch (error: any) {

            console.error(
                '    Error fatal de la API:',
                error.message
            );

            break;
        }


        // ----------------------------------------------------
        // 9. OBTENER LA RESPUESTA DEL MODELO
        // ----------------------------------------------------

        const candidate =
            respuesta.response
                .candidates?.[0];


        if (!candidate) {

            console.error(
                ' Gemini no devolvió una respuesta válida.'
            );

            break;
        }


        // Guardar respuesta en historial
        history.push(
            candidate.content
        );


        // ----------------------------------------------------
        // 10. COMPROBAR SI GEMINI SOLICITÓ UNA HERRAMIENTA
        // ----------------------------------------------------

        const call =
            respuesta.response.functionCalls();


        if (
            call &&
            call.length > 0
        ) {

            // Por ahora procesamos la primera herramienta
            const toolCall = call[0];


            // Buscar el nombre real de la herramienta MCP
            const nombreReal =
                mcpTools.tools.find(

                    t =>
                        t.name.replace(/-/g, '_') ===
                        toolCall.name

                )?.name
                ||
                toolCall.name;


            console.log(
                `    [Ejecutando Acción en Navegador]: ${nombreReal}`
            );


            // ------------------------------------------------
            // 11. EJECUTAR LA HERRAMIENTA MEDIANTE MCP
            // ------------------------------------------------

            try {

                const resultadoMcp =
                    await mcpClient.callTool({

                        name:
                            nombreReal,

                        arguments:
                            toolCall.args
                    });


                console.log(
                    '    Acción ejecutada correctamente.'
                );


                // ------------------------------------------------
                // 12. DEVOLVER EL RESULTADO A GEMINI
                // ------------------------------------------------

                history.push({

                    role: 'user',

                    parts: [

                        {

                            functionResponse: {

                                name:
                                    toolCall.name,

                                response: {

                                    result:
                                        resultadoMcp.content

                                }
                            }

                        }

                    ]
                });


            } catch (error: any) {

                console.log(
                    `    Error en la herramienta: ${error.message}`
                );


                // Informar del error a Gemini
                history.push({

                    role: 'user',

                    parts: [

                        {

                            functionResponse: {

                                name:
                                    toolCall.name,

                                response: {

                                    error:
                                        error.message

                                }
                            }

                        }

                    ]
                });
            }


        } else {

            // ------------------------------------------------
            // 13. GEMINI TERMINÓ LA AUDITORÍA
            // ------------------------------------------------

            console.log(
                '\n=================================='
            );

            console.log(
                ' REPORTE FINAL DE AUDITORÍA'
            );

            console.log(
                '==================================\n'
            );


            const final =
                respuesta.response.text();


            console.log(final);


            // ------------------------------------------------
            // 14. GUARDAR REPORTE
            // ------------------------------------------------

            const path = require('path');
            const dirName = path.dirname(archivoSpec);
            const nombreBase = path.basename(archivoSpec, '.md');
            const nombreReporte = path.join(dirName, `REPORTE_${nombreBase}_PLAYWRIGHT.md`);


            fs.writeFileSync(
                nombreReporte,
                final
            );


            console.log(
                `\n Reporte guardado en ${nombreReporte}`
            );


            completado = true;
        }
    }


    // --------------------------------------------------------
    // 15. FINALIZACIÓN
    // --------------------------------------------------------

    console.log(
        '\n Auditoría Finalizada.'
    );


    process.exit(0);
}


// ============================================================
// MANEJO DE ERRORES GENERALES
// ============================================================

iniciarAuditoria()
    .catch(error => {

        console.error(
            ' Error inesperado:',
            error
        );

        process.exit(1);

    });