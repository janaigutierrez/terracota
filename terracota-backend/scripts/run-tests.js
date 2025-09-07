#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors per consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

console.log(`${colors.magenta}🧪 Executant tests Terracotta Backend...${colors.reset}\n`);

// Configuració dels diferents tipus de tests
const testCommands = {
    all: ['npx', 'jest'],
    unit: ['npx', 'jest', 'tests/unit'],
    integration: ['npx', 'jest', 'tests/integration'],
    coverage: ['npx', 'jest', '--coverage'],
    watch: ['npx', 'jest', '--watch'],
    verbose: ['npx', 'jest', '--verbose']
};

// Obtenir el tipus de test dels arguments
const testType = process.argv[2] || 'all';

if (!testCommands[testType]) {
    console.error(`${colors.red}❌ Tipus de test no vàlid: ${testType}${colors.reset}`);
    console.log(`${colors.yellow}📋 Tipus disponibles:${colors.reset}`);
    Object.keys(testCommands).forEach(type => {
        console.log(`   - ${colors.blue}${type}${colors.reset}`);
    });
    process.exit(1);
}

console.log(`${colors.blue}🏃 Executant: ${testType} tests...${colors.reset}\n`);

// Executar el comando corresponent
const cmd = testCommands[testType];
const testProcess = spawn(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    shell: true // Això és clau per Windows!
});

testProcess.on('close', (code) => {
    console.log(''); // Línia en blanc
    if (code === 0) {
        console.log(`${colors.green}✅ Tests completats exitosament!${colors.reset}`);
        console.log(`${colors.green}🎉 Tot funciona correctament!${colors.reset}`);
    } else {
        console.log(`${colors.red}❌ Tests fallits amb codi: ${code}${colors.reset}`);
        console.log(`${colors.yellow}💡 Revisa els errors de dalt per més detalls${colors.reset}`);
        process.exit(code);
    }
});

testProcess.on('error', (error) => {
    console.error(`${colors.red}❌ Error executant tests: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}💡 Assegura't que Jest està instal·lat: npm install${colors.reset}`);
    process.exit(1);
});