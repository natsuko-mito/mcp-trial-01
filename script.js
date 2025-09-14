const fortunes = [
    {
        level: "大吉",
        className: "daikichi",
        message: "今日は最高の一日になりそうです！\n新しいことに挑戦するのに最適な日。\n積極的に行動すれば、きっと良い結果が待っています。"
    },
    {
        level: "吉",
        className: "kichi",
        message: "穏やかで良い一日になりそうです。\n小さな幸せを見つけることができるでしょう。\n周りの人への感謝を忘れずに。"
    },
    {
        level: "中吉",
        className: "chukichi",
        message: "まずまずの運勢です。\n慎重に行動すれば良い結果が得られそう。\n焦らず一歩ずつ進んでいきましょう。"
    },
    {
        level: "小吉",
        className: "shokichi",
        message: "小さな幸運が舞い込みそうです。\n見落としがちな良いことに気づけるかも。\n丁寧に過ごすことを心がけてください。"
    },
    {
        level: "凶",
        className: "kyo",
        message: "今日は少し注意が必要かもしれません。\nでも、困難は成長の機会です。\n前向きな気持ちで乗り越えていきましょう。"
    },
    {
        level: "大凶",
        className: "daikyo",
        message: "今日は慎重に過ごしましょう。\nピンチはチャンス！きっと明日は良い日になります。\n今は準備の時期と考えて、じっくり取り組みましょう。"
    }
];

class OmikujiApp {
    constructor() {
        this.drawButton = document.getElementById('drawButton');
        this.resetButton = document.getElementById('resetButton');
        this.result = document.getElementById('result');
        this.fortuneLevel = document.querySelector('.fortune-level');
        this.fortuneMessage = document.querySelector('.fortune-message');
        this.isDrawing = false;

        this.init();
    }

    init() {
        this.drawButton.addEventListener('click', () => this.drawFortune());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    drawFortune() {
        if (this.isDrawing) {
            return;
        }

        this.isDrawing = true;
        this.drawButton.style.pointerEvents = 'none';
        this.drawButton.textContent = 'おみくじを引いています...';

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * fortunes.length);
            const fortune = fortunes[randomIndex];

            this.displayResult(fortune);
        }, 1500);
    }

    displayResult(fortune) {
        this.fortuneLevel.textContent = fortune.level;
        this.fortuneLevel.className = `fortune-level ${fortune.className}`;
        this.fortuneMessage.textContent = fortune.message;

        this.result.classList.remove('hidden');
        this.drawButton.classList.add('hidden');
        this.resetButton.classList.remove('hidden');

        this.drawButton.style.pointerEvents = 'auto';
        this.drawButton.textContent = 'おみくじを引く';
        this.isDrawing = false;
    }

    reset() {
        this.result.classList.add('hidden');
        this.drawButton.classList.remove('hidden');
        this.resetButton.classList.add('hidden');

        this.fortuneLevel.className = 'fortune-level';
        this.fortuneLevel.textContent = '';
        this.fortuneMessage.textContent = '';
        this.isDrawing = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OmikujiApp();
});