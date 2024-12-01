const app = require('./app');
const config = require('./config/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Conecta ao banco de dados com tentativa de reconexão.
 */
async function connectToDatabase(retries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await prisma.$connect();
            console.log('Conectado ao banco de dados!');
            return;
        } catch (error) {
            console.error(`Erro ao conectar ao banco (tentativa ${attempt}/${retries}):`, error.message);
            if (attempt < retries) {
                console.log(`Tentando novamente em ${delay / 1000} segundos...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error('Falha ao conectar ao banco de dados após várias tentativas.');
                process.exit(1);
            }
        }
    }
}

/**
 * Encerra o servidor e desconecta do banco de dados.
 */
async function shutdown(server) {
    console.log('Encerrando servidor...');
    try {
        await prisma.$disconnect();
        console.log('Desconectado do banco de dados.');
    } catch (error) {
        console.error('Erro ao desconectar do banco de dados:', error.message);
    } finally {
        server.close(() => {
            console.log('Servidor encerrado.');
            process.exit(0);
        });
    }
}

/**
 * Inicializa o servidor.
 */
async function startServer() {
    try {
        await connectToDatabase();

        const port = config.port || 3000;
        const server = app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });

        // Eventos para encerramento do servidor
        process.on('SIGTERM', () => shutdown(server));
        process.on('SIGINT', () => shutdown(server));
    } catch (error) {
        console.error('Erro durante a inicialização do servidor:', error.message);
        process.exit(1);
    }
}

startServer();
