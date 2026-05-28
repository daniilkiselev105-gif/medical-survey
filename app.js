const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "12345";

// THEME

function toggleTheme(){

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
);

}

if(localStorage.getItem("theme") === "true"){

document.body.classList.add("dark");

}

// QUESTIONS

const questions = [

{
title:"Как часто наблюдается жидкий стул?",
answers:["Нет","1–2 раза в сутки","3–5 раз в сутки","Более 5 раз в сутки"]
},

{
title:"Есть ли рвота?",
answers:["Нет","1 раз","2–3 раза","Частая или многократная рвота"]
},

{
title:"Может ли человек нормально пить жидкость?",
answers:["Да","Пьёт меньше обычного","Пьёт с трудом","Отказывается или не может пить"]
},

{
title:"Испытываете ли человек жажду?",
answers:["Нет","Иногда","Часто","Постоянно"]
},

{
title:"Как часто происходит мочеиспускание?",
answers:["Как обычно","Немного реже","Редко","Практически нет"]
},

{
title:"Есть ли у сухость губ, языка или слизистых?",
answers:["Нет","Незначительная","Выраженная","Очень сильная"]
},

{
title:"Какое общее состояние наблюдается?",
answers:["Активный","Вялый","Слабый","Сонливый"]
},

{
title:"Повышалась ли температура?",
answers:["Нет","До 37.5","38–39","Выше 39"]
},

{
title:"Есть ли боли или дискомфорт в животе?",
answers:["Нет","Незначительные","Умеренные","Сильные боли или спазмы"]
},

{
title:"Обращались ли к врачу?",
answers:["Да","Планирую","Наблюдаю дома","Нет"]
}

];

const form = document.getElementById("quizForm");

questions.forEach((question,index)=>{

const div = document.createElement("div");

div.className = "question";

let html = `<h3>${index+1}. ${question.title}</h3>`;

question.answers.forEach((answer,i)=>{

html += `

<label class="option">

<input type="radio"
name="q${index}"
value="${i}">

${answer}

</label>

`;

});

div.innerHTML = html;

form.appendChild(div);

});

// QUIZ

async function calculateQuiz(){

let total = 0;

for(let i=0;i<questions.length;i++){

const checked = document.querySelector(
`input[name="q${i}"]:checked`
);

if(!checked){

alert("Ответьте на все вопросы");
return;

}

total += parseInt(checked.value);

}

let risk = "";
let className = "";
let recommendation = "";

// НИЗКИЙ РИСК

if(total <= 7){

risk = "Низкий риск";
className = "low";

recommendation = `
Состояние ребёнка относительно стабильное.
Рекомендуется продолжать питьевой режим,
оральную регидратацию и наблюдение за
состоянием ребёнка.
`;

}

// СРЕДНИЙ

else if(total <= 15){

risk = "Средний риск";
className = "medium";

recommendation = `
Имеются признаки обезвоживания средней степени.
Необходимо увеличить объём жидкости,
чаще предлагать солевые растворы и обратиться
к врачу в ближайшее время.
`;

}

// ВЫСОКИЙ

else{

risk = "Высокий риск";
className = "high";

recommendation = `
Высокий риск тяжёлого обезвоживания.
Требуется срочное обращение за медицинской помощью.

При выраженной слабости,
отсутствии мочеиспускания,
многократной рвоте или сонливости
необходимо вызвать скорую помощь.
`;

}

const result = document.getElementById("quizResult");

result.style.display = "block";

result.className = `quiz-result ${className}`;

result.innerHTML = `

<h2>${total} баллов</h2>

<h3>${risk}</h3>

<p style="margin-top:15px; line-height:1.8;">
${recommendation}
</p>

`;

const data = {

date:new Date().toLocaleString("ru-RU"),

score:total,

risk:risk,

recommendation:recommendation

};

// FIREBASE

try{

await firebaseAddDoc(
firebaseCollection(firebaseDB,"results"),
data
);

console.log("Сохранено");

}catch(error){

console.log(error);

alert("Ошибка Firebase");
}

}

// ADMIN

async function loginAdmin(){

const login =
document.getElementById("adminLogin").value;

const password =
document.getElementById("adminPassword").value;

if(
login !== ADMIN_LOGIN ||
password !== ADMIN_PASSWORD
){

alert("Неверный логин или пароль");

return;

}

document.getElementById("adminPanel")
.style.display = "block";

loadResults();

}

// LOAD RESULTS

async function loadResults(){

const resultsList =
document.getElementById("resultsList");

resultsList.innerHTML = "";

const snapshot = await firebaseGetDocs(
firebaseCollection(firebaseDB,"results")
);

let total = 0;
let high = 0;
let count = 0;

const chartData = [];

snapshot.forEach(doc=>{

const data = doc.data();

count++;
total += data.score;

if(data.score >= 16){
high++;
}

chartData.push(data.score);

resultsList.innerHTML += `

<div class="result-item">

<p><b>Дата:</b> ${data.date}</p>

<p><b>Баллы:</b> ${data.score}</p>

<p><b>Риск:</b> ${data.risk}</p>

</div>

`;

});

document.getElementById("totalTests")
.textContent = count;

document.getElementById("avgScore")
.textContent =
count
? Math.round(total / count)
: 0;

document.getElementById("highRisk")
.textContent = high;

new Chart(
document.getElementById("chart"),
{

type:"line",

data:{

labels:chartData.map((_,i)=>`Тест ${i+1}`),

datasets:[{

label:"Баллы",

data:chartData,

tension:0.4,

fill:true

}]

}

});

}

// LOADER FIX

window.onload = function(){

const loader = document.getElementById("loader");

if(loader){

setTimeout(()=>{

loader.style.opacity = "0";

loader.style.pointerEvents = "none";

setTimeout(()=>{

loader.remove();

},600);

},1000);

}

};
