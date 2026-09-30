import { Anthropic } from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function iniciarAuditoria() {
    console.log("📖 1. Leyendo Documento SDD...");
    const sddContent = fs.readFileSync('./auditoria_spec.md', 'utf-8');

    console.log("🔌 2. Conectando al Servidor MCP...");
    // Iniciamos el servidor MCP (usa Puppeteer/Playwright por debajo)
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-puppeteer"]
    });
    
    const mcpClient = new Client(
        { name: "auditor-app", version: "1.0" }, 
        { capabilities: {} }
    );
    await mcpClient.connect(transport);

    // Obtenemos las herramientas disponibles desde el servidor MCP
    const mcpTools = await mcpClient.listTools();
    console.log(`✅ Conectado. Herramientas encontradas: ${mcpTools.tools.length}`);

    // Mapeamos el formato de MCP al formato que pide la API de Anthropic
    const herramientasParaIA: Anthropic.Tool[] = mcpTools.tools.map(tool => ({
        name: tool.name,
        description: tool.description || "",
        input_schema: tool.inputSchema as Anthropic.Tool.InputSchema
    }));

    console.log("🧠 3. Iniciando el Agente de IA...");
    let completado = false;
    
    // Memoria de la conversación
    let mensajes: Anthropic.MessageParam[] = [
        { 
            role: 'user', 
            content: `Eres un Auditor de Sistemas Autónomo. Sigue estrictamente este SDD:\n\n${sddContent}` 
        }
    ];

    while (!completado) {
        console.log("   [IA Pensando...]");
        
        const respuesta = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: mensajes,
            tools: herramientasParaIA
        });

        // Verificamos si la IA decidió usar una herramienta del navegador
        if (respuesta.stop_reason === 'tool_use') {
            // Guardamos la respuesta de la IA en la memoria
            mensajes.push({ role: 'assistant', content: respuesta.content });

            // Buscamos la herramienta que la IA pidió usar
            const toolCall = respuesta.content.find(
                (c): c is Anthropic.ToolUseBlock => c.type === 'tool_use'
            );

            if (toolCall) {
                console.log(`   🛠️  [Ejecutando Acción en Navegador]: ${toolCall.name}`);
                
                // Le pasamos la orden de la IA al servidor MCP para que la ejecute en la web
                const resultadoMcp = await mcpClient.callTool({
                    name: toolCall.name,
                    arguments: toolCall.input as Record<string, unknown>
                });

                // Le devolvemos a la IA lo que pasó en la web
                mensajes.push({
                    role: 'user',
                    content: [
                        { 
                            type: 'tool_result', 
                            tool_use_id: toolCall.id, 
                            content: JSON.stringify(resultadoMcp.content) 
                        }
                    ]
                });
            }
        } else {
            // Si la IA ya no necesita herramientas, ha terminado de auditar
            console.log("\n==================================");
            console.log("📊 REPORTE FINAL DE AUDITORÍA");
            console.log("==================================\n");
            
            const textoFinal = respuesta.content.find(
                (c): c is Anthropic.TextBlock => c.type === 'text'
            );
            
            if (textoFinal) {
                console.log(textoFinal.text);
                fs.writeFileSync('./REPORTE_FINAL.md', textoFinal.text);
                console.log("\n📁 Reporte guardado en 'REPORTE_FINAL.md'");
            }
            completado = true;
        }
    }

    console.log("🏁 Auditoría Finalizada con éxito.");
    process.exit(0);
}

iniciarAuditoria().catch(console.error);
