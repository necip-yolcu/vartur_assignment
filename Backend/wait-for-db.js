// wait-for-db.js
const waitPort = require('wait-port');

(async () => {
    try {
        await waitPort({
            host: 'vartur_mysql',   // This should match the service name in your Docker Compose file
            port: 3306,   // MySQL default port
            timeout: 60000, // 60 seconds timeout (adjust as needed)
        });
        console.log('Database is ready. Starting the application...');
        process.exit(0);
    } catch (error) {
        console.error('Error waiting for the database:', error);
        process.exit(1);
    }
})();
