import { GoogleGenerativeAI, FunctionDeclaration } from '@google/generative-ai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Función de reintento (Backoff) para lidiar con el error 503 de la capa gratuita
async function conReintento(fn: () => Promise<any>, maxRetries = 10) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            if (error.message.includes('503') || error.message.includes('429')) {
                console.log(`   ⏳ Servidor de Google saturado (Intento ${i + 1}/${maxRetries}). Esperando 8 segundos para reintentar...`);
                await new Promise(res => setTimeout(res, 8000));
            } else {
                throw error;
            }
        }
    }
    throw new Error("El servidor falló repetidamente después de múltiples intentos.");
}

async function iniciarAuditoria() {
    // Tomar el archivo spec desde los argumentos de la consola (o usar el por defecto)
    const archivoSpec = process.argv[2] || './auditoria_spec.md';
    
    console.log(`📖 1. Leyendo Documento SDD (${archivoSpec})...`);
    if (!fs.existsSync(archivoSpec)) {
        console.error(`❌ El archivo ${archivoSpec} no existe.`);
        process.exit(1);
    }
    const sddContent = fs.readFileSync(archivoSpec, 'utf-8');

    console.log("🔌 2. Conectando al Servidor MCP...");
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-puppeteer"]
    });
    
    const mcpClient = new Client({ name: "auditor-app", version: "1.0" }, { capabilities: {} });
    await mcpClient.connect(transport);

    const mcpTools = await mcpClient.listTools();
    console.log(`✅ Conectado. Herramientas encontradas: ${mcpTools.tools.length}`);

    const herramientasGemini: FunctionDeclaration[] = mcpTools.tools.map(tool => {
        const schema = tool.inputSchema as any;
        return {
            name: tool.name.replace(/-/g, '_'),
            description: tool.description || "",
            parameters: {
                type: schema.type.toUpperCase(),
                properties: schema.properties,
                required: schema.required
            }
        };
    });

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.8-flash",
        tools: [{ functionDeclarations: herramientasGemini }]
    });

    console.log("🧠 3. Iniciando el Agente de IA (Gemini)...");
    
    let history: any[] = [
        {
            role: "user",
            parts: [{ text: `Eres un Agente Auditor Autónomo. Sigue estrictamente este SDD:\n\n${sddContent}\n\nUsa tus herramientas para realizar la tarea y cuando termines, escribe un reporte detallado con tus conclusiones.` }]
        }
    ];

    let completado = false;
    let iteracion = 0;

    while (!completado && iteracion < 15) {
        iteracion++;
        console.log("   [Gemini Pensando...]");
        
        let respuesta;
        try {
            // USAMOS LA FUNCIÓN DE REINTENTO AQUÍ
            respuesta = await conReintento(() => model.generateContent({ contents: history }));
        } catch (error: any) {
            console.error("   ⚠️ Error fatal de la API:", error.message);
            break;
        }

        const candidate = respuesta.response.candidates?.[0];
        if (!candidate) break;

        history.push(candidate.content);

        const call = respuesta.response.functionCalls();
        
        if (call && call.length > 0) {
            const toolCall = call[0];
            const nombreReal = mcpTools.tools.find(t => t.name.replace(/-/g, '_') === toolCall.name)?.name || toolCall.name;
            
            console.log(`   🛠️  [Ejecutando Acción en Navegador]: ${nombreReal}`);
            
            try {
                const resultadoMcp = await mcpClient.callTool({
                    name: nombreReal,
                    arguments: toolCall.args
                });

                history.push({
                    role: "user",
                    parts: [{
                        functionResponse: {
                            name: toolCall.name,
                            response: { result: resultadoMcp.content }
                        }
                    }]
                });
            } catch (error: any) {
                console.log(`   ⚠️ Error en la herramienta: ${error.message}`);
                history.push({
                    role: "user",
                    parts: [{
                        functionResponse: {
                            name: toolCall.name,
                            response: { error: error.message }
                        }
                    }]
                });
            }
        } else {
            console.log("\n==================================");
            console.log("📊 REPORTE FINAL DE AUDITORÍA");
            console.log("==================================\n");
            
            const final = respuesta.response.text();
            console.log(final);
            
            // Genera un nombre de archivo basado en el nombre del spec
            const nombreReporte = `REPORTE_${archivoSpec.replace('.md', '').replace('./', '')}.txt`;
            fs.writeFileSync(nombreReporte, final);
            console.log(`\n📁 Reporte guardado en ${nombreReporte}`);
            completado = true;
        }
    }
    
    console.log("🏁 Auditoría Finalizada.");
    process.exit(0);
}

iniciarAuditoria().catch(console.error);
