const puppeteer = require('puppeteer');
const readline = require('readline');

// Crie uma interface para interagir com o usuário no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Pergunte ao usuário qual URL ele deseja usar
rl.question('Qual procedimentimento irá fazer? \n 1. Abertura \n 2. Fechamento?', async (funcao) => {
    if (funcao == 1) {
        funcao = '101'
    }
    if (funcao == 2) {
        funcao = '112'
    }
    let nums = []
    for (let i = 101; i <= 153; i++) {
        nums.push(`Pdv ${i}`);
    }
    
    let pdvOptions = nums.map((nums, index) => `${index + 1}. ${nums}`).join(' \n ');
        // Verifique se a URL foi fornecida
    
    rl.question(`Escolha o pdv que deseja fazer o procedimento: \n x. Sair. \n 0. Todos Pdvs(NÃO DISPONÍVEL) \n ${pdvOptions} \n Escolha o PDV: `, async (num) => {
        
        if (num == 'x') {
            process.exit(0)
        }

        if (funcao && num) {
            let pdvIndex = parseInt(num, 10) - 1;
            let pdvNumber = pdvIndex + 101;

            // Formata o número com zero à esquerda se estiver entre 1 e 9
            if (pdvNumber < 110) {
                pdvNumber = pdvNumber.toString().padStart(3, '0');
            }

            const pdv = `http://192.168.119.${pdvNumber}:9898/normal.html`;
            const user = '498';
            const pass = '2389';
        
            function sleep(ms) { // function para definir tempo de espera
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
            async function main() {
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.goto(pdv);
        
                await sleep(500);  // meio segundo antes de pressionar 'Tab'
                await page.keyboard.press('Escape');
                await sleep(500);  // mais meio segundo antes de pressionar 'Tab'
                await page.keyboard.press('Escape');
                await sleep(500);  // mais meio segundo antes de pressionar 'Tab'
                await page.keyboard.press('Escape');
                await sleep(500);  // mais meio segundo antes de pressionar 'Tab'
                await page.keyboard.press('Escape');
        
                await page.type('div .barra_e #kbd_display_02', funcao);
                await sleep(1000);  // Espera 1 segundo antes de pressionar 'Tab'
                await page.keyboard.press('Tab');
        
                await sleep(1000);  // Espera 2 segundos antes de recarregar a página
                await page.reload();
        
                await sleep(1000);  // Espera 2 segundos antes de recarregar a página
                await page.type('div .barra_e #kbd_display_02', user);
                await page.keyboard.press('Enter');
                await sleep(1000);
                await page.type('div .barra_e #kbd_display_02', pass);
                await page.keyboard.press('Enter');
                // fechar o navegador
                await sleep(1000);
                await browser.close();
            }
        
            main();
        
            } else {
                console.log('Pdv não escontrado!');
            }
            console.log(`\n Pdv ${pdvOptions} operado com sucesso!`)
            rl.close()
    })
})

