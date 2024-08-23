const puppeteer = require('puppeteer');
const readline = require('readline');

// Crie uma interface para interagir com o usuário no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function operarPdv(pdvNumber, funcao) {
    const pdv = `http://192.168.119.${pdvNumber}:9898/normal.html`;
    const user = '498';
    const pass = '2389';

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pdv);

    await sleep(500);  // meio segundo antes de pressionar 'Escape'
    await page.keyboard.press('Escape');
    await sleep(500);  // mais meio segundo antes de pressionar 'Escape'
    await page.keyboard.press('Escape');
    await sleep(500);  // mais meio segundo antes de pressionar 'Escape'
    await page.keyboard.press('Escape');
    await sleep(500);  // mais meio segundo antes de pressionar 'Escape'
    await page.keyboard.press('Escape');

    await page.type('div .barra_e #kbd_display_02', funcao);
    await sleep(1000);  // Espera 1 segundo antes de pressionar 'Tab'
    await page.keyboard.press('Tab');

    await sleep(1000);  // Espera 1 segundo antes de recarregar a página
    await page.reload();

    await sleep(1000);  // Espera 1 segundo antes de digitar o usuário
    await page.type('div .barra_e #kbd_display_02', user);
    await page.keyboard.press('Enter');
    await sleep(1000);
    await page.type('div .barra_e #kbd_display_02', pass);
    await page.keyboard.press('Enter');

    await sleep(1000);
    await browser.close();
}

function perguntarPdv(funcao) {
    let nums = [];
    for (let i = 101; i <= 153; i++) {
        nums.push(`Pdv ${i}`);
    }

    let pdvOptions = nums.map((num, index) => `${index + 1}. ${num}`).join(' \n ');

    rl.question(`Escolha o pdv que deseja fazer o procedimento: \n x. Sair. \n 0. Todos Pdvs(NÃO DISPONÍVEL) \n ${pdvOptions} \n Escolha o PDV: `, async (num) => {
        if (num == 'x') {
            rl.close();
            return;
        }

        if (num !== '0' && num) {
            let pdvIndex = parseInt(num, 10) - 1;
            let pdvNumber = pdvIndex + 101;

            if (pdvNumber < 110) {
                pdvNumber = pdvNumber.toString().padStart(3, '0');
            }

            await operarPdv(pdvNumber, funcao);
            console.log(`\n PDV ${pdvNumber} operado com sucesso!`);
        } else {
            console.log('Opção de PDV inválida!');
        }

        perguntarPdv(funcao); // Pergunta novamente após operar
    });
}

// Pergunte ao usuário qual URL ele deseja usar
rl.question('Qual procedimento irá fazer? \n 1. Abertura \n 2. Fechamento? ', (funcao) => {
    if (funcao == 1) {
        funcao = '101';
    } else if (funcao == 2) {
        funcao = '112';
    } else {
        console.log('Opção de procedimento inválida!');
        rl.close();
        return;
    }

    perguntarPdv(funcao); // Começa o processo de pergunta de PDV
});
