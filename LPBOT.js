const { VK } = require('vk-io');
const vk = new VK();
const fs = require('fs');
const request = require('request');
const tts = require('google-tts-api');
const template = require('./Base/LPBOT_template.json');
const profile = require('./Base/profiles.json');
vk.setOptions({ token:"TYTTOKEN" });
ПЕРЕМЕННЫЕ: {
	var mynick = "NICK"
	var my_link = IDVK
	var test = 0
	var test2 = 0
	var test3 = 0
}
ФУНКЦИИ: {
	function Link(text) { return `@id${my_link} (${text})`}
	function save(){ fs.writeFileSync("./Base/profiles.json", JSON.stringify(profile, null, "\t")) }
	function SearchTemplate(id){ for(i=0;i<template.length;i++) { if(id == template[i].id) return i; } }
	function SearchProfiles(id){ for(i=0;i<profile.length;i++) { if(id == profile[i].id_vk) return i; } }
	function randomInteger(min, max) { let rand = min - 0.5 + Math.random() * (max - min + 1); return Math.round(rand); }
	function points(num) { try { var n = num.toString(); return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + '.'); } catch {return;} }
	function Patterns(txt, count){
	    for(i=0;i<template.length;i++){
	        count.push({
	            a: template[i].template_length,
	            id: template[i].id,
	            infoa: template[i].name
	        });
		}
	    count.sort(function(a, b) {
	        return b.a-a.a;
	    });
	    count.splice(100, count.length)
	    for(i=0;i<count.length;i++){

	        txt += `${Link(count[i].id)}. ${count[i].infoa} - ${Link(points(count[i].a))} S\n`
	    }
	    return txt;
	}
	function timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = `${date}.${month}.${year} в ${hour}:${min}`;
	  return time;
	}
	function times(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  let a1 = `${hour}`
	  let a2 = `${min}`
	  let a3 = `${date}`
		if(a1.length == 1) a1 = `0${a1}`
		if(a2.length == 1) a2 = `0${a2}`
		if(a3.length == 1) a3 = `0${a3}`
	  var time = `Дата: ${a3}.${month}.${year} Время: ${a1}:${a2}`;
	  return time;
	}
	function rand(text) {
	    let tts = Math.floor(text.length * Math.random())
	    return text[tts]
	}
	function declOfNum(n, text_forms) {  
	    n = Math.abs(n) % 100; var n1 = n % 10;
	    if (n > 10 && n < 20) { return text_forms[2]; }
	    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
	    if (n1 == 1) { return text_forms[0]; }
	    return text_forms[2];
	}
}
СТАРТ_ОШИБКИ: {
	console.log (`Почти_Лучший-ЛП_Бот-включён!\nВключённый аккаунт: ${mynick}\nАйди: @id${my_link}`);
	vk.updates.start().catch(console.error);
}
КОМАНДЫ: {

	vk.updates.on('message', async (next, context) => { 
		try {
			var mid = next.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(my_link);
		var test = profile[id].ignor
			for(i=0;i<test.length;i++){
				if(test[i] == player) vk.api.call("messages.delete", { message_ids: mid, delete_for_all: 0 }).catch((error) => {return;});
			}
				return context();
		} catch { return; }
	});
	vk.updates.hear(/^(?:решить)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			let answer = eval(`${context.$match[1]}`);
			vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} ${context.$match[1]} = ${answer}`
			});
			return;
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!\nНекорректный пример!`) }
	});
	vk.updates.hear(/^(?:\+друг|\+д|\+др)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			var u = await vk.api.messages.getById({ message_ids: mid})
			const fadd = await vk.api.friends.add({ user_id: u.items[0].reply_message.from_id });
		if(fadd == 1) {
				const [you] = await vk.api.users.get({ user_id: u.items[0].reply_message.from_id, fields: "sex", name_case: "acc"});
				vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} Заявка в друзья @id${u.items[0].reply_message.from_id} (${you.first_name} ${you.last_name}) отправлена✅`
				});
		}
		if(fadd == 2) {
				const [you] = await vk.api.users.get({ user_id: u.items[0].reply_message.from_id, fields: "sex", name_case: "acc"});
				vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} Заявка в друзья от @id${u.items[0].reply_message.from_id} (${you.first_name} ${you.last_name}) принята✅`
				});
		}
		if(fadd == 4) {
				const [you] = await vk.api.users.get({ user_id: u.items[0].reply_message.from_id, fields: "sex", name_case: "dat"});
				vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} Повторная отправка заявки в друзья пользователю @id${u.items[0].reply_message.from_id} (${you.first_name} ${you.last_name})✅`
				});
		}
		    setTimeout(() => {
				vk.api.messages.delete({
					message_ids: mid,
					delete_for_all: 1
				});
		    }, profile[id].sms_del * 1000);
		} catch {
			context.reply(`${profile[id].bot} Произошла ошибка!⚠\nВозможные причины были отправлены вам в лс.`)
			context.send({ peer_id: my_link, message: `${profile[id].bot} Возможные причины:\n\n1. Вы отвечаете на сообщение сообщества!\n2. Вы не отвечаете на сообщение!\n3. Вы отвечаете на своё сообщение!\n4. Вы не отвечаете а пересылаете сообщение!`})
		}
	});
	vk.updates.hear(/^(?:\-друг|\-д|\-др)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
				var u = await vk.api.messages.getById({ message_ids: mid})
				const [you] = await vk.api.users.get({ user_id: u.items[0].reply_message.from_id, fields: "sex"});
				const fadd = await vk.api.friends.delete({ user_id: u.items[0].reply_message.from_id });
		vk.api.messages.edit({
		    peer_id: context.peerId,
		    message_id: mid,
		    message: `${profile[id].bot} @id${u.items[0].reply_message.from_id} (${you.first_name} ${you.last_name}) удалён из друзей или заявка отклонена!✅`
		});
		    setTimeout(() => {
				vk.api.messages.delete({
					message_ids: mid,
					delete_for_all: 1
				});
		    }, profile[id].sms_del * 1000);
		} catch {
			context.reply(`${profile[id].bot} Произошла ошибка!⚠\nВозможные причины были отправлены вам в лс.`)
			context.send({ peer_id: my_link, message: `${profile[id].bot} Возможные причины:\n\n1. Вы отвечаете на сообщение сообщества!\n2. Вы не отвечаете на сообщение!\n3. Вы отвечаете на своё сообщение!\n4. Вы не отвечаете а пересылаете сообщение!`})
		}
	});
	vk.updates.hear(/^(?:\+лс)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		var u = await vk.api.messages.getById({ message_ids: mid})
		const [you] = await vk.api.users.get({ user_id: u.items[0].reply_message.from_id, fields: "sex"});
		vk.api.messages.send({ 
			user_id: u.items[0].reply_message.from_id, 
			message: context.$match[1] 
		});
		vk.api.messages.edit({
		    peer_id: context.peerId,
		    message_id: mid,
		    message: `${profile[id].bot} Пользователю @id${u.items[0].reply_message.from_id} (${you.first_name} ${you.last_name}) было отправленно сообщение из [${context.$match[1].length}] символов!✅`
		});
		    setTimeout(() => {
				vk.api.messages.delete({
					message_ids: mid,
					delete_for_all: 1
				});
		    }, profile[id].sms_del * 1000);
		} catch {
			context.reply(`${profile[id].bot} Произошла ошибка!⚠\nВозможные причины были отправлены вам в лс.`)
			context.send({ peer_id: my_link, message: `${profile[id].bot} Возможные причины:\n1. Вы отвечаете на сообщение сообщества!\n2. Вы не отвечаете на сообщение!\n3. Вы отвечаете на своё сообщение!\n4. Вы не отвечаете а пересылаете сообщение!`})
		}
	});
	vk.updates.hear(/^(?:\+шаблон|\+шаб)\s([0-9]+)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(context.$match[1] == 1) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #1 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 1` });
		profile[id].template.num_1 = `${context.$match[2]}` }
		if(context.$match[1] == 2) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #2 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 2` });
		profile[id].template.num_2 = `${context.$match[2]}` }
		if(context.$match[1] == 3) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #3 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 3` });
		profile[id].template.num_3 = `${context.$match[2]}` }
		if(context.$match[1] == 4) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #4 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 4` });
		profile[id].template.num_4 = `${context.$match[2]}` }
		if(context.$match[1] == 5) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #5 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 5` });
		profile[id].template.num_5 = `${context.$match[2]}` }
		if(context.$match[1] == 6) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #6 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 6` });
		profile[id].template.num_6 = `${context.$match[2]}` }
		if(context.$match[1] == 7) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #7 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 7` });
		profile[id].template.num_7 = `${context.$match[2]}` }
		if(context.$match[1] == 8) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #8 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 8` });
		profile[id].template.num_8 = `${context.$match[2]}` }
		if(context.$match[1] == 9) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Шаблон #9 добавлен! [${context.$match[2].length} S]\nДля вызова: Шаблон 9` });
		profile[id].template.num_9 = `${context.$match[2]}` }
		if(context.$match[1] == 0 || context.$match[1] >= 10) return context.reply(`${profile[id].bot} Только 9 слотов под шаблоны!`)
		save();	
		return;
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:шаблон|шаб)\s([0-9]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(context.$match[1] == 1) { if(profile[id].template.num_1 == "") return context.reply(`${profile[id].bot} Шаблон #1 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_1}`});
		return; }
		if(context.$match[1] == 2) { if(profile[id].template.num_2 == "") return context.reply(`${profile[id].bot} Шаблон #2 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_2}`});
		return; }
		if(context.$match[1] == 3) { if(profile[id].template.num_3 == "") return context.reply(`${profile[id].bot} Шаблон #3 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_3}`});
		return; }
		if(context.$match[1] == 4) { if(profile[id].template.num_4 == "") return context.reply(`${profile[id].bot} Шаблон #4 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_4}`});
		return; }
		if(context.$match[1] == 5) { if(profile[id].template.num_5 == "") return context.reply(`${profile[id].bot} Шаблон #5 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_5}`});
		return; }
		if(context.$match[1] == 6) { if(profile[id].template.num_6 == "") return context.reply(`${profile[id].bot} Шаблон #6 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_6}`});
		return; }
		if(context.$match[1] == 7) { if(profile[id].template.num_7 == "") return context.reply(`${profile[id].bot} Шаблон #7 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_7}`});
		return; }
		if(context.$match[1] == 8) { if(profile[id].template.num_8 == "") return context.reply(`${profile[id].bot} Шаблон #8 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_8}`});
		return; }
		if(context.$match[1] == 9) { if(profile[id].template.num_9 == "") return context.reply(`${profile[id].bot} Шаблон #9 пустой!`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].template.num_9}`});
		return; }
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:добавить пак)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		for(i=0;i<template.length;i++){ if(template[i].name == context.$match[1]) return context.reply(`${profile[id].bot} Такой Пак Шаблонов уже есть! [${template[i].id}]`) }
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Пак Шаблонов [${context.$match[1]}] добавлен!`});
		await template.push({ id: template.length+1, activ: true, name: context.$match[1], template_1: profile[id].template.num_1, template_2: profile[id].template.num_2, template_3: profile[id].template.num_2, template_4: profile[id].template.num_4, template_5: profile[id].template.num_5, template_6: profile[id].template.num_6, template_7: profile[id].template.num_7, template_8: profile[id].template.num_8, template_9: profile[id].template.num_9, template_length: profile[id].template.num_1.length+profile[id].template.num_2.length+profile[id].template.num_3.length+profile[id].template.num_4.length+profile[id].template.num_5.length+profile[id].template.num_6.length+profile[id].template.num_6.length+profile[id].template.num_7.length+profile[id].template.num_8.length+profile[id].template.num_9.length
		});
		fs.writeFileSync("./Base/LPBOT_template.json", JSON.stringify(template, null, "\t"))
		} catch { context.reply(`Ошибка!⚠ Вам нельзя вызывать шаблон!`) }
	});
			vk.updates.hear(/^(?:.хелп)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} 💬 Список сигналов: https://vk.com/@198168797-komandy-signaly-lp\n🆘 Группа ВК: https://vk.com/club198168797\n\n\nMeow | LongPoll API Beta`
			});
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!`) }
	});
	vk.updates.hear(/^(?:.инфа вся)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} 🖥 LP v. 1.3.3 CUSTOM 🖥

📚 Команды: .хелп 📚
✨ Разработчик кастом версии: [iris_duty_2020|Славка Андреев] ✨
📲 Дата последнего обновления: 24.08.2020 📲
🎃 Разработчик официальной версии - [iris_duty_2020|Славка Андреев]. 🎃
👨‍💻 Помогал в тестировании: [lalalalalalala247364|Роман Романов] 👨‍💻
🦠 Данные о коронавирусе: [coronavirus-monitor.ru/statistika|тут] 🦠
👨‍💻 Агенты ТП <<Meow>> - .агенты 👨‍💻

📖 Данная версия защищена авторским правом. 📖
📕 При распространении указать автора - [iris_duty_2020|Славка Андреев] 📕\n\n\nMeow | LongPoll API Beta`
			});
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!`) }
	});
	vk.updates.hear(/^(?:.агенты)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} 👨‍💻 Список Агентов ТП <<Meow>> 👨‍💻

💻 [iris_duty_2020|Славка Андреев] 💻
💻 [lalalalalalala247364|Роман Романов] 💻
💻 [zenoviov|Сергей Зиновьев (By samids)] 💻

📖 Им задавать Вопросы. 📖
📕 Что бы стать агентом писать [iris_duty_2020|ему] 📕`
			});
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!`) }
	});
	vk.updates.hear(/^(?:.гит хаб)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({
		    	peer_id: context.peerId,
		    	message_id: mid,
		    	message: `${profile[id].bot} 📖 Ссылка на этот LP в гит хаб 1.3.5: https://github.com/samids/Meow-LP-Iris-CM-vk-long-poll 📖`
			});
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!`) }
	});
	vk.updates.hear(/^(?:загрузить пак)\s([0-9]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var uid = await SearchProfiles(player);
			var id = await SearchTemplate(context.$match[1])
		if(!template[id]) return context.reply(`${profile[uid].bot} Не нашёл такой Пак Шаблонов!!\n[${context.$match[1]} - ${template.length}]`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[uid].bot} Пак Шаблонов [${template[id].name}] загружен!\n[${context.$match[1]} - ${template.length}]`});
		profile[uid].template.num_1 = template[id].template_1
		profile[uid].template.num_2 = template[id].template_2
		profile[uid].template.num_3 = template[id].template_3
		profile[uid].template.num_4 = template[id].template_4
		profile[uid].template.num_5 = template[id].template_5
		profile[uid].template.num_6 = template[id].template_6
		profile[uid].template.num_7 = template[id].template_7
		profile[uid].template.num_8 = template[id].template_8
		profile[uid].template.num_9 = template[id].template_9
		save();
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:список паков)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		    var txt = "";
		    var counter = [];
		    txt = `${Patterns(txt, counter)}\n`
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Список Паков Шаблонов:\n\n${txt}\n\nДля загрузик: Загрузить пак [номер]`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:\+|плюс)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(profile[id].special_character == true) vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} ${profile[id].special_characters.plus}`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:\*|умножить)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(profile[id].special_character == true) vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} ${profile[id].special_characters.multiply}`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:\-|минус)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(profile[id].special_character == true) vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} ${profile[id].special_characters.minus}`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:копи|копия)\s([0-9]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var u = await vk.api.messages.getById({ message_ids: mid})
		if(!u.items[0].reply_message.text) return vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст для копирования не найден!` });
		if(context.$match[1] == 0 || context.$match[1] >= 10) return context.reply(`${profile[id].bot} Только 9 слотов под шаблоны!`)
		if(context.$match[1] == 1) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #1! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 1` });
		profile[id].template.num_1 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 2) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #2! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 2` });
		profile[id].template.num_2 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 3) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #3! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 3` });
		profile[id].template.num_3 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 4) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #4! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 4` });
		profile[id].template.num_4 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 5) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #5! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 5` });
		profile[id].template.num_5 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 6) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #6! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 6` });
		profile[id].template.num_6 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 7) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #7! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 7` });
		profile[id].template.num_7 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 8) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #8! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 8` });
		profile[id].template.num_8 = `${u.items[0].reply_message.text}` }
		if(context.$match[1] == 9) { vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${profile[id].bot} Текст скопирован в Шаблон #9! [${u.items[0].reply_message.text.length} S]\nДля вызова: Шаблон 9` });
		profile[id].template.num_9 = `${u.items[0].reply_message.text}` }
		save();
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:\+ссылка)\s([^]+)\s([^]+)$/i, async (context) => {
		// try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
			if(context.$match[1] == 2 || context.$match[1] == "лс") {
				context.reply(`${profile[id].bot} ссылка на лс заменена!✅`)
		profile[id].link.link2 = `${context.$match[2]}`
			}
			if(context.$match[1] == 1 || context.$match[1] == "стрн") {
				context.reply(`${profile[id].bot} ссылка на страницу заменена!✅`)
		profile[id].link.link1 = `${context.$match[2]}`
			}
			if(context.$match[1] == 3 || context.$match[1] == "ссыль") {
				context.reply(`${profile[id].bot} ссылка заменена!✅`)
		profile[id].link.link3 = `${context.$match[2]}`
			}
		save();
		// } catch { context.reply(`${profile[id].bot} ошибка!`)}
	});
	vk.updates.hear(/^(?:\.обо мне)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var text = ``;
		text += `${profile[id].bot} @id${my_link} (${profile[id].name_fam.name} ${profile[id].name_fam.fam}):\n\n`;
		text += `Уровень прав: ${profile[id].name_fam.status}\n\n`
		text += `ЯП: Node.JS\nВерсия: Meow BETA\nОснователь: @id598958885 (ㄠsʟᴀᴠᴋᴀ | ᴇᴅɪᴛs ~ Музыкант♪ ㄠ)\n\n`
		text += `\nСсылка на страницу: ${profile[id].link.link1}`
		text += `\nСсылка на ЛС: ${profile[id].link.link2}`
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${text}`});
		} catch { context.reply(`${profile[id].bot} Произошла ошибка!`) }
	});
	vk.updates.hear(/^(?:удалить сообщение замена|.усз)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var u = await vk.api.messages.getById({ message_ids: mid})
		if(u.items[0].reply_message.from_id !== my_link) return context.reply(`${profile[id].bot} можно удалять только свои сообщения!⚠`)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: u.items[0].reply_message.id, message: `${profile[id].bot} 😇`});
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} 😇`});
		vk.api.messages.delete({ message_ids: u.items[0].reply_message.id, delete_for_all: 1 });
		vk.api.messages.delete({ message_ids: mid, delete_for_all: 1 });
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:удалить сообщение|.ус)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var u = await vk.api.messages.getById({ message_ids: mid})
		if(u.items[0].reply_message.from_id !== my_link) return context.reply(`${profile[id].bot} Можно удалять только свои сообщения!⚠`)
		vk.api.messages.delete({ message_ids: u.items[0].reply_message.id, delete_for_all: 1 });
		vk.api.messages.delete({ message_ids: mid, delete_for_all: 1 });
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:.шрифты)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} мои шрифты:

		1. 𝒂 𝒃 𝒄
		2. 𝕒 𝕓 𝕔
		3. 𝓪 𝓫 𝓬
		4. 🅐 🅑 🅒
		5. 🄰 🄱 🄲
		6. 𝖆 𝖇 𝖈
		7. ɥ ǝ ʇ
		8. ᗩ ᗷ ᑕ
		9. ᴀ ʙ ᴄ
		10. ɐ q ɔ
		11. a&#0822; &#0822;b&#0822; &#0822;c&#0822;
		12. a&#1161; b&#1161; c&#1161;

		Что-бы писать: .шрифт [номер] [текст]`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`) }
	});
	vk.updates.hear(/^(?:.шрифт)\s([0-9]+)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		if(context.$match[1] == 1) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "𝒂 𝒃 𝒄 𝒅 𝒆 𝒇 𝒈 𝒉 𝒊 𝒋 𝒌 𝒍 𝒎 𝒏 𝒐 𝒑 𝒒 𝒓 𝒔 𝒕 𝒖 𝒗 𝒘 𝒙 𝒚 𝒛 𝑨 𝑩 𝑪 𝑫 𝑬 𝑭 𝑮 𝑯 𝑰 𝑱 𝑲 𝑳 𝑴 𝑵 𝑶 𝑷 𝑸 𝑹 𝑺 𝑻 𝑼 𝑽 𝑾 𝑿 𝒀 𝒁 𝒂 𝒃 𝒗 𝒈 𝒅 𝒆 𝒆 𝒛𝒉 𝒛 𝒊 𝒚 𝒌 𝒍 𝒎 𝒏 𝒐 𝒑 𝒓 𝒔 𝒕 𝒖 𝒇 𝒉 𝒕𝒔 𝒄𝒉 𝒔𝒉 𝒔𝒄𝒉 𝒊 ' ' 𝒆 𝒚𝒖 𝒚𝒂 𝑨 𝑩 𝑽 𝑮 𝑫 𝑬 𝑬 𝒁𝑯 𝒁 𝑰 𝒀 𝑲 𝑳 𝑴 𝑵 𝑶 𝑷 𝑹 𝑺 𝑻 𝑼 𝑭 𝑯 𝑻𝑺 𝑪𝑯 𝑺𝑯 𝑺𝑪𝑯 𝑰 ' ' 𝑬 𝒀𝑼 𝒀𝑨".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 2) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫 𝔸 𝔹 ℂ 𝔻 𝔼 𝔽 𝔾 ℍ 𝕀 𝕁 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℚ ℝ 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏 𝕐 ℤ 𝕒 𝕓 𝕧 𝕘 𝕕 𝕖 𝕖 𝕫𝕙 𝕫 𝕚 𝕪 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕣 𝕤 𝕥 𝕦 𝕗 𝕙 𝕥𝕤 𝕔𝕙 𝕤𝕙 𝕤𝕔𝕙 𝕚 ' ' 𝕖 𝕪𝕦 𝕪𝕒 𝔸 𝔹 𝕍 𝔾 𝔻 𝔼 𝔼 ℤℍ ℤ 𝕀 𝕐 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℝ 𝕊 𝕋 𝕌 𝔽 ℍ 𝕋𝕊 ℂℍ 𝕊ℍ 𝕊ℂℍ 𝕀 ' ' 𝔼 𝕐𝕌 𝕐𝔸".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 3) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "𝓪 𝓫 𝓬 𝓭 𝓮 𝓯 𝓰 𝓱 𝓲 𝓳 𝓴 𝓵 𝓶 𝓷 𝓸 𝓹 𝓺 𝓻 𝓼 𝓽 𝓾 𝓿 𝔀 𝔁 𝔂 𝔃 𝓐 𝓑 𝓒 𝓓 𝓔 𝓕 𝓖 𝓗 𝓘 𝓙 𝓚 𝓛 𝓜 𝓝 𝓞 𝓟 𝓠 𝓡 𝓢 𝓣 𝓤 𝓥 𝓦 𝓧 𝓨 𝓩 𝓪 𝓫 𝓿 𝓰 𝓭 𝓮 𝓮 𝔃𝓱 𝔃 𝓲 𝔂 𝓴 𝓵 𝓶 𝓷 𝓸 𝓹 𝓻 𝓼 𝓽 𝓾 𝓯 𝓱 𝓽𝓼 𝓬𝓱 𝓼𝓱 𝓼𝓬𝓱 𝓲 ' ' 𝓮 𝔂𝓾 𝔂𝓪 𝓐 𝓑 𝓥 𝓖 𝓓 𝓔 𝓔 𝓩𝓗 𝓩 𝓘 𝓨 𝓚 𝓛 𝓜 𝓝 𝓞 𝓟 𝓡 𝓢 𝓣 𝓤 𝓕 𝓗 𝓣𝓢 𝓒𝓗 𝓢𝓗 𝓢𝓒𝓗 𝓘 ' ' 𝓔 𝓨𝓤 𝓨𝓐".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 4) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "🅐 🅑 🅒 🅓 🅔 🅕 🅖 🅗 🅘 🅙 🅚 🅛 🅜 🅝 🅞 🅟 🅠 🅡 🅢 🅣 🅤 🅥 🅦 🅧 🅨 🅩 🅐 🅑 🅒 🅓 🅔 🅕 🅖 🅗 🅘 🅙 🅚 🅛 🅜 🅝 🅞 🅟 🅠 🅡 🅢 🅣 🅤 🅥 🅦 🅧 🅨 🅩 🅐 🅑 🅥 🅖 🅓 🅔 🅔 🅩🅗 🅩 🅘 🅨 🅚 🅛 🅜 🅝 🅞 🅟 🅡 🅢 🅣 🅤 🅕 🅗 🅣🅢 🅒🅗 🅢🅗 🅢🅒🅗 🅘 ' ' 🅔 🅨🅤 🅨🅐 🅐 🅑 🅥 🅖 🅓 🅔 🅔 🅩🅗 🅩 🅘 🅨 🅚 🅛 🅜 🅝 🅞 🅟 🅡 🅢 🅣 🅤 🅕 🅗 🅣🅢 🅒🅗 🅢🅗 🅢🅒🅗 🅘 ' ' 🅔 🅨🅤 🅨🅐".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 5) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "🄰 🄱 🄲 🄳 🄴 🄵 🄶 🄷 🄸 🄹 🄺 🄻 🄼 🄽 🄾 🄿 🅀 🅁 🅂 🅃 🅄 🅅 🅆 🅇 🅈 🅉 🄰 🄱 🄲 🄳 🄴 🄵 🄶 🄷 🄸 🄹 🄺 🄻 🄼 🄽 🄾 🄿 🅀 🅁 🅂 🅃 🅄 🅅 🅆 🅇 🅈 🅉 🄰 🄱 🅅 🄶 🄳 🄴 🄴 🅉🄷 🅉 🄸 🅈 🄺 🄻 🄼 🄽 🄾 🄿 🅁 🅂 🅃 🅄 🄵 🄷 🅃🅂 🄲🄷 🅂🄷 🅂🄲🄷 🄸 ' ' 🄴 🅈🅄 🅈🄰 🄰 🄱 🅅 🄶 🄳 🄴 🄴 🅉🄷 🅉 🄸 🅈 🄺 🄻 🄼 🄽 🄾 🄿 🅁 🅂 🅃 🅄 🄵 🄷 🅃🅂 🄲🄷 🅂🄷 🅂🄲🄷 🄸 ' ' 🄴 🅈🅄 🅈🄰".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 6) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "𝖆 𝖇 𝖈 𝖉 𝖊 𝖋 𝖌 𝖍 𝖎 𝖏 𝖐 𝖑 𝖒 𝖓 𝖔 𝖕 𝖖 𝖗 𝖘 𝖙 𝖚 𝖛 𝖜 𝖝 𝖞 𝖟 𝕬 𝕭 𝕮 𝕯 𝕰 𝕱 𝕲 𝕳 𝕴 𝕵 𝕶 𝕷 𝕸 𝕹 𝕺 𝕻 𝕼 𝕽 𝕾 𝕿 𝖀 𝖁 𝖂 𝖃 𝖄 𝖅 𝖆 𝖇 𝖛 𝖌 𝖉 𝖊 𝖊 𝖟𝖍 𝖟 𝖎 𝖞 𝖐 𝖑 𝖒 𝖓 𝖔 𝖕 𝖗 𝖘 𝖙 𝖚 𝖋 𝖍 𝖙𝖘 𝖈𝖍 𝖘𝖍 𝖘𝖈𝖍 𝖎 ' ' 𝖊 𝖞𝖚 𝖞𝖆 𝕬 𝕭 𝖁 𝕲 𝕯 𝕰 𝕰 𝖅𝕳 𝖅 𝕴 𝖄 𝕶 𝕷 𝕸 𝕹 𝕺 𝕻 𝕽 𝕾 𝕿 𝖀 𝕱 𝕳 𝕿𝕾 𝕮𝕳 𝕾𝕳 𝕾𝕮𝕳 𝕴 ' ' 𝕰 𝖄𝖀 𝖄𝕬".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 7) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "ɥ ǝ ʇ ɟ q p s ɐ l d o ᴉ b ʍ ʞ ɾ ɯ ʌ ƃ ɔ z ɹ u ʎ x n ʎ ǝ ʇ ɟ q p s ɐ l d o ᴉ b ʍ ʞ ɾ ɯ ʌ ƃ ɔ z ɹ u ʎ x n ɥ ǝ ɹ s ɟ q q nɐ n l x o ᴉ b ʍ ʞ ɾ ʌ ƃ ɔ z p ɐ ɔƃ ʇɐ ƃɐ ƃʇɐ l ' ' q xz xɥ ʎ ǝ ɹ s ɟ q q nɐ n l x o ᴉ b ʍ ʞ ɾ ʌ ƃ ɔ z p ɐ ɔƃ ʇɐ ƃɐ ƃʇɐ l ' ' q xz xʎ ".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 8) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "ᗩ ᗷ ᑕ ᗪ ᗴ ᖴ ᘜ ᕼ I ᒍ K ᒪ ᗰ ᑎ O ᑭ ᑫ ᖇ Տ T ᑌ ᐯ ᗯ ᙭ Y ᘔ ᗩ ᗷ ᑕ ᗪ ᗴ ᖴ ᘜ ᕼ I ᒍ K ᒪ ᗰ ᑎ O ᑭ ᑫ ᖇ Տ T ᑌ ᐯ ᗯ ᙭ Y ᘔ ᗩ ᗷ ᐯ ᘜ ᗪ ᗴ ᗴ ᘔᕼ ᘔ I Y K ᒪ ᗰ ᑎ O ᑭ ᖇ Տ T ᑌ ᖴ ᕼ TՏ ᑕᕼ Տᕼ Տᑕᕼ I ' ' ᗴ Yᑌ Yᗩ ᗩ ᗷ ᐯ ᘜ ᗪ ᗴ ᗴ ᘔᕼ ᘔ I Y K ᒪ ᗰ ᑎ O ᑭ ᖇ Տ T ᑌ ᖴ ᕼ TՏ ᑕᕼ Տᕼ Տᑕᕼ I ' ' ᗴ Yᑌ Yᗩ".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 9) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "ᴀ ʙ ᴄ ᴅ ᴇ ғ ɢ ʜ ɪ ᴊ ᴋ ʟ ᴍ ɴ ᴏ ᴘ ǫ ʀ s ᴛ ᴜ ᴠ ᴡ x ʏ ᴢ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ᴀ ʙ ᴠ ɢ ᴅ ᴇ ᴇ ᴢʜ ᴢ ɪ ʏ ᴋ ʟ ᴍ ɴ ᴏ ᴘ ʀ s ᴛ ᴜ ғ ʜ ᴛs ᴄʜ sʜ sᴄʜ ɪ ' ' ᴇ ʏᴜ ʏᴀ A B V G D E E ZH Z I Y K L M N O P R S T U F H TS CH SH SCH I ' ' E YU YA".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 10) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "ɐ q ɔ p ǝ ɟ ƃ ɥ ı ɾ ʞ l ɯ u o d ᕹ ɹ s ʇ n ʌ ʍ x ʎ z ɐ q ɔ p ǝ ɟ ƃ ɥ ı ɾ ʞ l ɯ u o d ᕹ ɹ s ʇ n ʌ ʍ x ʎ z ɐ ƍ ʚ ɹ ɓ ǝ ǝ ж ε и ņ ʞ v w н о u d ɔ ɯ ʎ ȸ х ǹ Һ m m q qı q є ıo ʁ ɐ ƍ ʚ ɹ ɓ ǝ ǝ ж ε и ņ ʞ v w н о u d ɔ ɯ ʎ ȸ х ǹ Һ m m q qı q є ıo ʁ".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 11) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "&#0822;a&#0822; &#0822;b&#0822; &#0822;c&#0822; &#0822;d&#0822; &#0822;e&#0822; &#0822;f&#0822; &#0822;g&#0822; &#0822;h&#0822; &#0822;i&#0822; &#0822;j&#0822; &#0822;k&#0822; &#0822;l&#0822; &#0822;m&#0822; &#0822;n&#0822; &#0822;o&#0822; &#0822;p&#0822; &#0822;q&#0822; &#0822;r&#0822; &#0822;s&#0822; &#0822;t&#0822; &#0822;u&#0822; &#0822;v&#0822; &#0822;w&#0822; &#0822;x&#0822; &#0822;y&#0822; &#0822;z&#0822; &#0822;A&#0822; &#0822;B&#0822; &#0822;C&#0822; &#0822;D&#0822; &#0822;E&#0822; &#0822;F&#0822; &#0822;G&#0822; &#0822;H&#0822; &#0822;I&#0822; &#0822;J&#0822; &#0822;K&#0822; &#0822;L&#0822; &#0822;M&#0822; &#0822;N&#0822; &#0822;O&#0822; &#0822;P&#0822; &#0822;Q&#0822; &#0822;R&#0822; &#0822;S&#0822; &#0822;T&#0822; &#0822;U&#0822; &#0822;V&#0822; &#0822;W&#0822; &#0822;X&#0822; &#0822;Y&#0822; &#0822;Z&#0822; &#0822;а&#0822; &#0822;б&#0822; &#0822;в&#0822; &#0822;г&#0822; &#0822;д&#0822; &#0822;е&#0822; &#0822;ё&#0822; &#0822;ж&#0822; &#0822;з&#0822; &#0822;и&#0822; &#0822;й&#0822; &#0822;к&#0822; &#0822;л&#0822; &#0822;м&#0822; &#0822;н&#0822; &#0822;о&#0822; &#0822;п&#0822; &#0822;р&#0822; &#0822;с&#0822; &#0822;т&#0822; &#0822;у&#0822; &#0822;ф&#0822; &#0822;х&#0822; &#0822;ц&#0822; &#0822;ч&#0822; &#0822;ш&#0822; &#0822;щ&#0822; &#0822;ъ&#0822; &#0822;ы&#0822; &#0822;ь&#0822; &#0822;э&#0822; &#0822;ю&#0822; &#0822;я&#0822; &#0822;А&#0822; &#0822;Б&#0822; &#0822;В&#0822; &#0822;Г&#0822; &#0822;Д&#0822; &#0822;Е&#0822; &#0822;Ё&#0822; &#0822;Ж&#0822; &#0822;З&#0822; &#0822;И&#0822; &#0822;Й&#0822; &#0822;К&#0822; &#0822;Л&#0822; &#0822;М&#0822; &#0822;Н&#0822; &#0822;О&#0822; &#0822;П&#0822; &#0822;Р&#0822; &#0822;С&#0822; &#0822;Т&#0822; &#0822;У&#0822; &#0822;Ф&#0822; &#0822;Х&#0822; &#0822;Ц&#0822; &#0822;Ч&#0822; &#0822;Ш&#0822; &#0822;Щ&#0822; &#0822;Ъ&#0822; &#0822;Ы&#0822; &#0822;Ь&#0822; &#0822;Э&#0822; &#0822;Ю&#0822; &#0822;Я".split(/&#0822; +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		if(context.$match[1] == 12) {
		transliterate = (function() {var
		rus = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я".split(/ +/g),
		eng = "a&#1161; b&#1161; c&#1161; d&#1161; e&#1161; f&#1161; g&#1161; h&#1161; i&#1161; j&#1161; k&#1161; l&#1161; m&#1161; n&#1161; o&#1161; p&#1161; q&#1161; r&#1161; s&#1161; t&#1161; u&#1161; v&#1161; w&#1161; x&#1161; y&#1161; z&#1161; A&#1161; B&#1161; C&#1161; D&#1161; E&#1161; F&#1161; G&#1161; H&#1161; I&#1161; J&#1161; K&#1161; L&#1161; M&#1161; N&#1161; O&#1161; P&#1161; Q&#1161; R&#1161; S&#1161; T&#1161; U&#1161; V&#1161; W&#1161; X&#1161; Y&#1161; Z&#1161; а&#1161; б&#1161; в&#1161; г&#1161; д&#1161; е&#1161; ё&#1161; ж&#1161; з&#1161; и&#1161; й&#1161; к&#1161; л&#1161; м&#1161; н&#1161; о&#1161; п&#1161; р&#1161; с&#1161; т&#1161; у&#1161; ф&#1161; х&#1161; ц&#1161; ч&#1161; ш&#1161; щ&#1161; ъ&#1161; ы&#1161; ь&#1161; э&#1161; ю&#1161; я&#1161; А&#1161; Б&#1161; В&#1161; Г&#1161; Д&#1161; Е&#1161; Ё&#1161; Ж&#1161; З&#1161; И&#1161; Й&#1161; К&#1161; Л&#1161; М&#1161; Н&#1161; О&#1161; П&#1161; Р&#1161; С&#1161; Т&#1161; У&#1161; Ф&#1161; Х&#1161; Ц&#1161; Ч&#1161; Ш&#1161; Щ&#1161; Ъ&#1161; Ы&#1161; Ь&#1161; Э&#1161; Ю&#1161; Я&#1161;".split(/ +/g);return function(text, engToRus){var x;for(x = 0; x < rus.length; x++) {text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);}
		return text;}})(); var txt = `${context.$match[2]}`; vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${transliterate(txt)}`});
		}
		} catch { context.reply(`${profile[id].bot} Ошибка!`) }
	});
	vk.updates.hear(/^(?:\+чел|\+доб)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		if(!context.chatId) return context.reply(`${profile[id].bot} Ошибка!⚠\nРаботает только в беседах!`)
		var link = context.$match[1].split('vk.com/')[1];
		if(link == undefined) var link = context.$match[1].split('|')[0].substr(1); //test.object_id
		const test = await vk.api.utils.resolveScreenName({ screen_name: link });
		const [user_sex] = await vk.api.users.get({ user_id: test.object_id, fields: "sex"});
		var nick = `@id${test.object_id} (${user_sex.first_name} ${user_sex.last_name})`
		var user1 = await vk.api.messages.getChat({ chat_id: context.chatId })
		var user = user1.users
		for(i=0;i<user.length;i++){ if(user[i] == test.object_id) return context.reply(`${profile[id].bot} Пользователь ${nick} и так находится в беседе!✅`) }
		vk.api.messages.addChatUser({ chat_id: context.chatId, user_id: test.object_id });
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Пользователь ${nick} был добавлен в беседу!✅`});
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠\nВозможно не верная ссылка!`) }
	});
	vk.updates.hear(/^(?:\+чел|\+доб)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		if(mid_from.items[0].reply_message == undefined) return context.send(`${profile[id].bot} вы не отвечаете на сообщение!`)
		const message = mid_from.items[0].reply_message.from_id
		var id = await SearchProfiles(player);
		if(!context.chatId) return context.reply(`${profile[id].bot} Ошибка!⚠\nРаботает только в беседах!`)
		const [user_sex] = await vk.api.users.get({ user_id: message, fields: "sex"});
		var nick = `@id${message} (${user_sex.first_name} ${user_sex.last_name})`
		var user1 = await vk.api.messages.getChat({ chat_id: context.chatId })
		var user = user1.users
		for(i=0;i<user.length;i++){ if(user[i] == message) return context.reply(`${profile[id].bot} Пользователь ${nick} и так находится в беседе!✅`) }
		vk.api.messages.addChatUser({ chat_id: context.chatId, user_id: message });
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} Пользователь ${nick} был добавлен в беседу!✅`});
		} catch { context.reply(`${profile[id].bot} ошибка!⚠\nВозможно не верная ссылка!`) }
	});
	vk.updates.hear(/^(?:.символы|.символов)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var u = await vk.api.messages.getById({ message_ids: mid})
		if(!u.items[0].reply_message.text) return context.reply(`${profile[id].bot} В тексте нет символов!`);
		context.reply(`${profile[id].bot} В тексте ${points(u.items[0].reply_message.text.length)} символов✅`);
		} catch { return; }
	});
	vk.updates.hear(/^(?:.настройки)$/i, async (context) => {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} настройка дежурного :

			1. NICK дежурного: [${profile[id].bot}]
			2. Авто-Удаление сообщения: [${Link(profile[id].sms_del)}] сек

			- |\\ \n[${profile[id].special_characters.minus}]
			+ |\\ \n[${profile[id].special_characters.plus}]
			* |\\ \n[${profile[id].special_characters.multiply}]

			Анти-Мат разрешение: [${Link(profile[id].antimat)}]
			${Link(`Анти-Мат Текст`)}: \n[${profile[id].antimat_text}]

			Изменить: +Настройка [1-2] [значение]

			Настроить Анти-Мат: +ам [текст] / -ам

			Символы: +сим [+|-|*] [текст]
			Символы: сим [да/нет]`});
	});
	vk.updates.hear(/^(?:\+настройка|\+н)\s([0-9]+)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		if(context.$match[1] == 1) {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} настройка [NICK бота] изменена на:\n[${context.$match[2]}]`});
		profile[id].bot = context.$match[2]
		}
		if(context.$match[1] == 2) {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} настройка [Авто-Удаление сообщения] изменена на:\n[${Number(context.$match[2])} сек]`});
		profile[id].sms_del = Number(context.$match[2])
		}
		save();
		} catch {context.reply(`${profile[id].bot} ошибка!`)}
	});
	vk.updates.hear(/^(?:.повторить)\s([^]+)\s([0-9]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		var step = 0;
		for(step=0;step<context.$match[2];step++){
			context.send(`${context.$match[1]}`)
		}
		}catch{return context.send(`${profile[id].bot} Ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:\+антиматы|\+антимат|\+ам)$/i, async (context) => {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} режим анти-маты включён!\nСлово замены: ***`});
			profile[id].antimat = true
			profile[id].antimat_text = `***`
			save();
	});
	vk.updates.hear(/^(?:\+антиматы|\+антимат|\+ам)\s([^]+)$/i, async (context) => {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
			vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} режим анти-маты включён!✅\nСлово замены: ${context.$match[1]}`});
			profile[id].antimat = true
			profile[id].antimat_text = context.$match[1]
			save();
	});
	vk.updates.hear(/^(?:-антиматы|-антимат|-ам)$/i, async (context) => {
		var mid = context.id
		var mid_from = await vk.api.messages.getById({ message_ids: mid});
		var player = mid_from.items[0].from_id
		if(player !== my_link) return;
		var id = await SearchProfiles(player);
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} режим анти-маты отключён!✅`});
		profile[id].antimat = false
		profile[id].antimat_text = `***`
		save();
	});
	vk.updates.hear(/^(?:.удал|.удалить)\s([0-9]+)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${context.$match[2]}`});
		    setTimeout(() => {
		    	vk.api.messages.delete({ message_ids: mid, delete_for_all: 1 }); 
		    }, context.$match[1] * 1000);
		} catch { context.reply(`${profile[id].bot} ошибка!`)}
	});
	vk.updates.hear(/^(?:.зудал|.зудалить)\s([0-9]+)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${context.$match[2]}`});
		    setTimeout(() => {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} сообщение удалено!✅`});
		    	vk.api.messages.delete({ message_ids: mid, delete_for_all: 1 }); 
		    }, context.$match[1] * 1000);
		} catch { context.reply(`${profile[id].bot} Ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:сим|символ|симы|символы)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		if(context.$match[1] == "да" || context.$match[1] == "Да" || context.$match[1] == "ДА" || context.$match[1] == "дА") {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} реакция на символы включена!`});
		profile[id].special_character = true
		}
		if(context.$match[1] !== "да" && context.$match[1] !== "Да" && context.$match[1] !== "ДА" && context.$match[1] !== "дА") {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} реакция на символы отключена!`});
		profile[id].special_character = false
		}
		save();
		} catch { context.reply(`${profile[id].bot} ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:\+сим|\+символ|спецсимвол)\s([^])\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
		var id = await SearchProfiles(player);
		if(context.$match[1] == "+") {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} реакция на символ <<+>> была заменена!`});
			profile[id].special_characters.plus = `${context.$match[2]}`
		}
		if(context.$match[1] == "-") {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} реакция на символ <<->> была заменена!`});
			profile[id].special_characters.minus = `${context.$match[2]}`
		}
		if(context.$match[1] == "*") {
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} реакция на символ <<*>> была заменена!`});	
			profile[id].special_characters.multiply = `${context.$match[2]}`
		}
		save();
		} catch { context.reply(`${profile[id].bot} ошибка!`)}
	});
	vk.updates.hear(/^(?:чек)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
				var id = await SearchProfiles(player);
		var link = context.$match[1].split('vk.com/')[1];
		if(link == undefined) var link = context.$match[1].split('|')[0].substr(1);
		const test = await vk.api.utils.resolveScreenName({ screen_name: link });
		const message = test.object_id
		const [u] = await vk.api.users.get({ user_id: message, fields: "photo_id, verified, sex, bdate, city, country, home_town, has_photo, photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig, online, domain, has_mobile, contacts, site, education, universities, schools, status, last_seen, followers_count, common_count, occupation, nickname, relatives, relation, personal, connections, exports, activities, interests, music, movies, tv, books, games, about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message, can_send_friend_request, is_favorite, is_hidden_from_feed, timezone, screen_name, maiden_name, crop_photo, is_friend, friend_status, career, military, blacklisted, blacklisted_by_me, can_be_invited_group" });
		if(u.has_photo == 1) var ava = await vk.api.utils.getShortLink({ url: `${u.photo_max_orig}`, private: 0 });
		var txt = ``;
		var URL = `http://vk.com/foaf.php?id=${message}`;
		request(URL, function (err, res, body) {
		    if (err) throw err;
		var a = body.split('<ya:created dc:date="')[1]; // 50ml
		if(a !== undefined) {
		var b = a.split('<ya:lastLoggedIn dc:date="')[0]; // 50ml
		var c = b.slice(0, 10)
		var e = b.slice(11, 16)
		var yearh = c.split('-')[0];
		var month = c.split('-')[1];
		var day = c.split('-')[2];
		}

		if(u.deactivated && u.deactivated == "banned") {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		txt += `Пользователь заблокирован!`
		}
		if(u.deactivated && u.deactivated == "deleted") {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		txt += `Пользователь удалён!`
		}

		if(!u.deactivated) {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		if(u.screen_name !== undefined) txt += `✏ Адрес: ${u.screen_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.friend_status == 3 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Является другом.\n`
		if(u.friend_status == 2 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Имеется входящая заявка.\n`
		if(u.friend_status == 1 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Отправлена заявка.\n`
		if(u.friend_status == 0 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Не является другом.\n`
		if(u.has_photo == 1) {
		txt += `📸 Ссылка на аву: ${ava.short_url}\n`
		}
		if(u.id !== my_link && u.common_count !== undefined) txt += `👥 Общих друзей: ${points(u.common_count)}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		if(u.status) txt += `✒ Статус: ${u.status}\n`
		if(!u.status) txt += `✒ Статус: Не указан!\n`
		if(u.online == 0 && u.last_seen && u.sex == 1) txt += `⚾ Активность ${u.last_seen.platform}: Была ${timeConverter(u.last_seen.time)}\n`
		if(u.online == 0 && u.last_seen && u.sex == 2) txt += `⚾ Активность ${u.last_seen.platform}: Был ${timeConverter(u.last_seen.time)}\n`
		if(u.online == 0 && !u.last_seen) txt += `⚾ Сейчас: Не в сети \n`
		if(u.online == 1 && !u.online_app) txt += `🎾 В сети: С Компьютера\n`	
		if(u.online == 1 && u.online_app && u.online_app == 2274003) txt += `🎾 В сети: С Android\n`
		if(u.online == 1 && u.online_app && u.online_app == 3140623) txt += `🎾 В сети: С IPhone\n`
		if(u.online == 1 && u.online_app && u.online_app == 6146827) txt += `🎾 В сети: С Vk.me\n`
		if(u.online == 1 && u.online_app && u.online_app !== 3140623 && u.online_app !== 2274003 && u.online_app !== 6146827) txt += `🎾 В сети.\n`
		if(u.country) txt += `🌎 Страна: ${u.country.title}\n`
		if(u.city) txt += `🗺 Город: ${u.city.title}\n`
		if(u.home_town !== "" && u.home_town !== undefined && u.city && u.home_town !== u.city.title) txt += `🗾 Родной город: ${u.home_town}\n`
		if(u.bdate) txt += `🎂 Дата рождения: ${u.bdate}\n`
		if(u.relation == 1 && u.sex == 1) txt += `💌 СП: Не замужем.\n`
		if(u.relation == 1 && u.sex == 2) txt += `💌 СП: Не женат.\n`
		if(u.relation == 2 && u.sex == 1) txt += `💌 СП: Есть друг.\n`
		if(u.relation == 2 && u.sex == 2) txt += `💌 СП: Есть подруга.\n`
		if(u.relation == 3 && u.sex == 1) txt += `💌 СП: Помолвлена.\n`
		if(u.relation == 3 && u.sex == 2) txt += `💌 СП: Помолвлен.\n`
		if(u.relation == 4 && u.sex == 1) txt += `💌 СП: Замужем.\n`
		if(u.relation == 4 && u.sex == 2) txt += `💌 СП: Женат.\n`
		if(u.relation == 5) txt += `💌 СП: Всё сложно.\n`
		if(u.relation == 6) txt += `💌 СП: В активном поиске.\n`
		if(u.relation == 7 && u.sex == 1) txt += `💌 СП: Влюблена.\n`
		if(u.relation == 7 && u.sex == 2) txt += `💌 СП: Влюблён.\n`
		if(u.relation == 8) txt += `💌 СП: В гражданском браке.\n`
		if(u.relation == 0) txt += `💌 СП: Не указано.\n`
		if(u.relation_partner) txt += `💒 В СП: @id${u.relation_partner.id} (${u.relation_partner.first_name} ${u.relation_partner.last_name})\n`
		if(u.verified == 1) txt += `🌟 Верификация: Есть\n`
		if(u.verified == 2) txt += `🌟 Верификация: Нет\n`
		if(u.followers_count) txt += `👑 Подписчиков: ${points(u.followers_count)}\n`
		if(u.games !== "" && u.games !== undefined) txt += `\n🕹 Игры: ${u.games}\n`
		if(u.movies !== "" && u.movies !== undefined) txt += `\n🎥 Фильмы: ${u.movies}\n`
		if(u.music !== "" && u.music !== undefined) txt += `\n🎶 Музыка: ${u.music}\n`
		if(u.tv !== "" && u.tv !== undefined) txt += `\n📺 Телешоу: ${u.tv}\n`
		if(u.interests !== "" && u.interests !== undefined) txt += `\n🕵‍♂ Интересы: ${u.interests}\n`
		if(u.books !== "" && u.books !== undefined) txt += `\n📙 Книги: ${u.books}\n`
		if(u.activities !== "" && u.activities !== undefined) txt += `\n👨‍🌾 Деятельность: ${u.activities}\n`
		if(u.about !== "" && u.about !== undefined) txt += `\n📜 О себе: ${u.about}\n`
		if(u.quotes !== "" && u.quotes !== undefined) txt += `\n☝ Цитаты: ${u.quotes}\n`
		if(a !== undefined && u.sex == 1) txt += `\n📅 Зарегистрировалась: ${Link(`${day}`)}.${Link(`${month}`)}.${Link(`${yearh}`)} в ${Link(`${e}`)}\n`
		if(a !== undefined && u.sex == 2) txt += `\n📅 Зарегистрировался: ${Link(`${day}`)}.${Link(`${month}`)}.${Link(`${yearh}`)} в ${Link(`${e}`)}\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		if(u.online == 0 && u.last_seen) txt += `📌 Узнать об активности: ПАктив`
		}
		if(u.online_app) console.log(u.online_app)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, dont_parse_links: 1, message: `${profile[id].bot} информация:\n\n${txt}`});
		});
		} catch { context.reply(`${profile[id].bot} ошибка!`)}
	}); 
	vk.updates.hear(/^(?:пактив)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		context.reply(`${profile[id].bot} номера активности:

		1 — мобильная версия;
		2 — приложение для iPhone;
		3 — приложение для iPad;
		4 — приложение для Android;
		5 — приложение для Windows Phone;
		6 — приложение для Windows 10;
		7 — полная версия сайта.`)
		} catch { context.reply(`${profile[id].bot} ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:чек)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
				var id = await SearchProfiles(player);
		if(mid_from.items[0].reply_message == undefined) return context.send(`${profile[id].bot} вы не отвечаете на сообщение!⚠`)
		const message = mid_from.items[0].reply_message.from_id
		const [u] = await vk.api.users.get({ user_id: message, fields: "photo_id, verified, sex, bdate, city, country, home_town, has_photo, photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig, online, domain, has_mobile, contacts, site, education, universities, schools, status, last_seen, followers_count, common_count, occupation, nickname, relatives, relation, personal, connections, exports, activities, interests, music, movies, tv, books, games, about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message, can_send_friend_request, is_favorite, is_hidden_from_feed, timezone, screen_name, maiden_name, crop_photo, is_friend, friend_status, career, military, blacklisted, blacklisted_by_me, can_be_invited_group" });
		if(u.has_photo == 1) var ava = await vk.api.utils.getShortLink({ url: `${u.photo_max_orig}`, private: 0 });
		var txt = ``;
		var URL = `http://vk.com/foaf.php?id=${message}`;
		request(URL, function (err, res, body) {
		    if (err) throw err;
		var a = body.split('<ya:created dc:date="')[1]; // 50ml
		if(a !== undefined) {
		var b = a.split('<ya:lastLoggedIn dc:date="')[0]; // 50ml
		var c = b.slice(0, 10)
		var e = b.slice(11, 16)
		var yearh = c.split('-')[0];
		var month = c.split('-')[1];
		var day = c.split('-')[2];
		}

		if(u.deactivated && u.deactivated == "banned") {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		txt += `Пользователь заблокирован!`
		}
		if(u.deactivated && u.deactivated == "deleted") {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		txt += `Пользователь удалён!`
		}

		if(!u.deactivated) {
		txt += `👤 И.Ф: ${u.first_name} ${u.last_name}\n`
		if(u.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		if(u.screen_name !== undefined) txt += `✏ Адрес: ${u.screen_name}\n`
		txt += `🆔 Цифровой ID: ${u.id}\n`
		if(u.friend_status == 3 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Является другом.\n`
		if(u.friend_status == 2 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Имеется входящая заявка.\n`
		if(u.friend_status == 1 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Отправлена заявка.\n`
		if(u.friend_status == 0 && u.id !== my_link) txt += `🎭 Cтатус дружбы: Не является другом.\n`
		if(u.has_photo == 1) {
		txt += `📸 Ссылка на аву: ${ava.short_url}\n`
		}
		if(u.id !== my_link && u.common_count !== undefined) txt += `👥 Общих друзей: ${points(u.common_count)}\n`
		if(u.sex == 1) txt += `👚 Пол: Женский\n`
		if(u.sex == 2) txt += `👕 Пол: Мужской\n`
		if(u.status) txt += `✒ Статус: ${u.status}\n`
		if(!u.status) txt += `✒ Статус: Не указан!\n`
		if(u.online == 0 && u.last_seen && u.sex == 1) txt += `⚾ Активность ${u.last_seen.platform}: Была ${timeConverter(u.last_seen.time)}\n`
		if(u.online == 0 && u.last_seen && u.sex == 2) txt += `⚾ Активность ${u.last_seen.platform}: Был ${timeConverter(u.last_seen.time)}\n`
		if(u.online == 0 && !u.last_seen) txt += `⚾ Сейчас: Не в сети \n`
		if(u.online == 1 && !u.online_app) txt += `🎾 В сети: С Компьютера\n`	
		if(u.online == 1 && u.online_app && u.online_app == 2274003) txt += `🎾 В сети: С Android\n`
		if(u.online == 1 && u.online_app && u.online_app == 3140623) txt += `🎾 В сети: С IPhone\n`
		if(u.online == 1 && u.online_app && u.online_app == 6146827) txt += `🎾 В сети: С Vk.me\n`
		if(u.online == 1 && u.online_app && u.online_app !== 3140623 && u.online_app !== 2274003 && u.online_app !== 6146827) txt += `🎾 В сети.\n`
		if(u.country) txt += `🌎 Страна: ${u.country.title}\n`
		if(u.city) txt += `🗺 Город: ${u.city.title}\n`
		if(u.home_town !== "" && u.home_town !== undefined && u.city && u.home_town !== u.city.title) txt += `🗾 Родной город: ${u.home_town}\n`
		if(u.bdate) txt += `🎂 Дата рождения: ${u.bdate}\n`
		if(u.relation == 1 && u.sex == 1) txt += `💌 СП: Не замужем.\n`
		if(u.relation == 1 && u.sex == 2) txt += `💌 СП: Не женат.\n`
		if(u.relation == 2 && u.sex == 1) txt += `💌 СП: Есть друг.\n`
		if(u.relation == 2 && u.sex == 2) txt += `💌 СП: Есть подруга.\n`
		if(u.relation == 3 && u.sex == 1) txt += `💌 СП: Помолвлена.\n`
		if(u.relation == 3 && u.sex == 2) txt += `💌 СП: Помолвлен.\n`
		if(u.relation == 4 && u.sex == 1) txt += `💌 СП: Замужем.\n`
		if(u.relation == 4 && u.sex == 2) txt += `💌 СП: Женат.\n`
		if(u.relation == 5) txt += `💌 СП: Всё сложно.\n`
		if(u.relation == 6) txt += `💌 СП: В активном поиске.\n`
		if(u.relation == 7 && u.sex == 1) txt += `💌 СП: Влюблена.\n`
		if(u.relation == 7 && u.sex == 2) txt += `💌 СП: Влюблён.\n`
		if(u.relation == 8) txt += `💌 СП: В гражданском браке.\n`
		if(u.relation == 0) txt += `💌 СП: Не указано.\n`
		if(u.relation_partner) txt += `💒 В СП: @id${u.relation_partner.id} (${u.relation_partner.first_name} ${u.relation_partner.last_name})\n`
		if(u.verified == 1) txt += `🌟 Верификация: Есть\n`
		if(u.verified == 2) txt += `🌟 Верификация: Нет\n`
		if(u.followers_count) txt += `👑 Подписчиков: ${points(u.followers_count)}\n`
		if(u.games !== "" && u.games !== undefined) txt += `\n🕹 Игры: ${u.games}\n`
		if(u.movies !== "" && u.movies !== undefined) txt += `\n🎥 Фильмы: ${u.movies}\n`
		if(u.music !== "" && u.music !== undefined) txt += `\n🎶 Музыка: ${u.music}\n`
		if(u.tv !== "" && u.tv !== undefined) txt += `\n📺 Телешоу: ${u.tv}\n`
		if(u.interests !== "" && u.interests !== undefined) txt += `\n🕵‍♂ Интересы: ${u.interests}\n`
		if(u.books !== "" && u.books !== undefined) txt += `\n📙 Книги: ${u.books}\n`
		if(u.activities !== "" && u.activities !== undefined) txt += `\n👨‍🌾 Деятельность: ${u.activities}\n`
		if(u.about !== "" && u.about !== undefined) txt += `\n📜 О себе: ${u.about}\n`
		if(u.quotes !== "" && u.quotes !== undefined) txt += `\n☝ Цитаты: ${u.quotes}\n`
		if(a !== undefined && u.sex == 1) txt += `\n📅 Зарегистрировалась: ${Link(`${day}`)}.${Link(`${month}`)}.${Link(`${yearh}`)} в ${Link(`${e}`)}\n`
		if(a !== undefined && u.sex == 2) txt += `\n📅 Зарегистрировался: ${Link(`${day}`)}.${Link(`${month}`)}.${Link(`${yearh}`)} в ${Link(`${e}`)}\n`
		txt += `📝 Ссылка: vk.com/id${u.id}\n\n`
		if(u.online == 0 && u.last_seen) txt += `📌 Узнать об активности: ПАктив`
		}
		if(u.online_app) console.log(u.online_app)
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, dont_parse_links: 1, message: `${profile[id].bot} информация:\n\n${txt}`});
		});
		} catch { context.reply(`${profile[id].bot} ошибка!`)}
	});
	vk.updates.hear(/^(?:ус|ус |дд|дд |дм|дм )([0-9]+)$/i, async (context) => {
		try {
				var mid = context.id
				var mid_from = await vk.api.messages.getById({ message_ids: mid});
				var player = mid_from.items[0].from_id
				if(player !== my_link) return;
				var id = await SearchProfiles(player);
				if(context.$match[1] > 199) return context.reply(`${profile[id].bot} много! [${context.$match[1]} > 199]`)
		var mk = []
		const u = await vk.api.messages.getHistory({ peer_id: context.peerId, count: Number(context.$match[1]) + Number(1) });
		var mass = u.items
		for(i=0;i<mass.length;i++){if(mass[i].from_id == my_link && mass[i].id !== mid) mk.push(mass[i].id);}
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, message: `${profile[id].bot} удалил ${mk.length} ${declOfNum(mk.length, ['сообщение', 'сообщений', 'сообщений'])}!`});
		for(i=0;i<mk.length;i++){ vk.api.call("messages.delete", { message_ids: mk, delete_for_all: 1 }).catch((error) => {return;});}
		setTimeout(() => { vk.api.call("messages.delete", { message_ids: mid, delete_for_all: 1 }).catch((error) => {return;});}, profile[id].sms_del * 1000);
		} catch {context.send(`${profile[id].bot} ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:.ус|.ус |.дд|.дд |.дм|.дм )([0-9]+)$/i, async (context) => {
		try {
				var mid = context.id
				var mid_from = await vk.api.messages.getById({ message_ids: mid});
				var player = mid_from.items[0].from_id
				if(player !== my_link) return;
				var id = await SearchProfiles(player);
				if(context.$match[1] >= 200) return context.reply(`${profile[id].bot} много! [${context.$match[1]} > 199]`)
			const u = await vk.api.messages.getHistory({ peer_id: context.peerId, count: Number(context.$match[1]) + Number(1) });
		var mass = u.items
		var mk = []
		   		vk.api.call("messages.delete", { message_ids: mid, delete_for_all: 1 }).catch((error) => {return;}); 
			for(i=0;i<mass.length;i++){
		   		mk.push(mass[i].id);
		   	}
		   	for(i=0;i<mk.length;i++){
		   		vk.api.call("messages.delete", { message_ids: mk, delete_for_all: 0 }).catch((error) => {return;}); 
		   	}
		} catch {context.send(`${profile[id].bot} ошибка!⚠`)}
	});
	vk.updates.hear(/^(?:мдруг|мд|мдр|мд )([0-9]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			if(player !== my_link) return;
			var id = await SearchProfiles(player);
		const u = await vk.api.messages.getHistory({ peer_id: context.peerId, count: Number(context.$match[1]) + Number(1) });
		var mass = u.items
		var mk = [];
		vk.api.messages.edit({
		    peer_id: context.peerId,
		    message_id: mid,
		    message: `${profile[id].bot} некоторым пользователям чата была отправлена заявка в друзья!✅`
		});
			for(i=0;i<mass.length;i++){
				mk.push(mass[i].id);
					for(i=0;i<mass.length;i++){
						if(mass[i].from_id !== my_link && mass[i].from_id >= 1) var fadd = await vk.api.friends.add({ user_id: mass[i].from_id });
		   		}
			}
		} catch { return; }
	});
	vk.updates.hear(/^(?:бот кто|bot кто|б кто)\s([^]+)$/i, async (context) => {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
			let phrases = rand(['Наверно, ', 'Вполне вероятно, ', 'Возможно, ', 'Скорее всего, ', 'Открою страшную тайну, ', 'хм, может быть '])
			if(!context.chatId) {
			let test = rand(['Орёл','Решка'])
	    	context.reply(`${phrases}${context.$match[1]} — ${test}`);
			return;
			}
	    	let b = await vk.api.messages.getConversationMembers({peer_id: context.peerId, fields: "users"}); 
	    	b = rand(b.items)
	   	 	g = b.member_id
	    	const [user_info] = await vk.api.users.get({ user_ids: g}); 
	    	context.reply(`${phrases}${context.$match[1]} — ${user_info.first_name} ${user_info.last_name}`);
	});
	vk.updates.hear(/^(?:\+игнор|\+иг)$/i, async (context) => {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
			if(mid_from.items[0].reply_message == undefined) return context.send(`${profile[id].bot} вы не отвечаете на сообщение!⚠`)
			const message = mid_from.items[0].reply_message.from_id
			if(message == my_link) return context.reply(`${profile[id].bot} себя нельзя игнорить⚠`)
			const [user_info] = await vk.api.users.get({ user_ids: message}); 
			var test = profile[id].ignor
				for(i=0;i<test.length;i++){
					if(test[i] == message) return context.reply(`${profile[id].bot} Пользователь @id${message} (${user_info.first_name} ${user_info.last_name}) уже находиться в Игнор-Списке⚠`)
				}
			test.push(message);
			context.reply(`${profile[id].bot} Пользователь @id${message} (${user_info.first_name} ${user_info.last_name}) добавлен в Игнор-Список✅`)
			save();
	});
	vk.updates.hear(/^(?:\+игнор беседа|\+иг б)$/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		if(!context.chatId) return; 
		var user1 = await vk.api.messages.getChat({ chat_id: context.chatId })
		profile[id].ignor = user1.users
		profile[id].ignor.splice(profile[id].ignor.indexOf(my_link), 1);
		context.reply(`${profile[id].bot} все участNICKи беседы были добавлены в Игнор-Список.`)
		save();
	});
	vk.updates.hear(/^(?:\-игнор|\-иг)$/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		if(mid_from.items[0].reply_message == undefined) return context.send(`${profile[id].bot} вы не отвечаете на сообщение!⚠`)
		const message = mid_from.items[0].reply_message.from_id
		if(message == my_link) return context.reply(`${profile[id].bot} вас нет в Игнор-Списке⚠`)
		const [user_info] = await vk.api.users.get({ user_ids: message}); 
		var test = profile[id].ignor
		test.splice(test.indexOf(message), 1);
		context.reply(`${profile[id].bot} Пользователь @id${message} (${user_info.first_name} ${user_info.last_name}) убран из игнора✅`)
		save();
	});
	vk.updates.hear(/^(?:\-игнор|\-иг)\s([^]+)$/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		var link = context.$match[1].split('vk.com/')[1];
		if(link == undefined) var link = context.$match[1].split('|')[0].substr(1); //test.object_id
		const test1 = await vk.api.utils.resolveScreenName({ screen_name: link });
		var message = test1.object_id
		if(message == my_link) return context.reply(`${profile[id].bot} вас нет в Игнор-Списке⚠`)
		const [user_info] = await vk.api.users.get({ user_ids: message}); 
		var test = profile[id].ignor
		test.splice(test.indexOf(message), 1);
		context.reply(`${profile[id].bot} Пользователь @id${message} (${user_info.first_name} ${user_info.last_name}) убран из игнора✅`)
		save();
	});
	vk.updates.hear(/^(?:\--игнор|\--иг)$/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		var test = profile[id].ignor
		if(test.length == 0) return context.reply(`${profile[id].bot} Игнор-Список и так пуст!⚠`)
		test.length = 0
		context.reply(`${profile[id].bot} Игнор-Список удалён!✅`)
		save();
	});
	vk.updates.hear(/^(?:.моя инфа)$/i, async (context) => {
		var mid = context.id
				var mid_from = await vk.api.messages.getById({ message_ids: mid});
				var player = mid_from.items[0].from_id
				var id = await SearchProfiles(player);
				if(player !== my_link) return;
		var one = await vk.api.account.getProfileInfo({ });
		var txt = ``;
		txt += `👤 И.Ф: [id${one.id}|${one.first_name} ${one.last_name}]\n`
		if(one.maiden_name) txt += `👗 Девичья фамилия: ${u.maiden_name}\n`
		if(one.sex == 1) txt += `👚 Пол: [id${one.id}|Женский]\n`
		if(one.sex == 2) txt += `👕 Пол: [id${one.id}|Мужской]\n`
		txt += `✏ Адрес: ${one.screen_name}\n`
		if(one.country) txt += `🌎 Страна: ${one.country.title}\n`
		if(one.city) txt += `🗺 Город: ${one.city.title}\n`
		if(one.home_town !== "" && one.home_town !== undefined && one.city && one.home_town !== one.city.title) txt += `🗾 Родной город: ${one.home_town}\n`
		if(one.bdate) txt += `🎂 Дата рождения: ${one.bdate}\n`
		if(one.status) txt += `✒ Статус: ${one.status}\n`
		if(!one.status) txt += `✒ Статус: Не указан!\n`
		if(one.phone && one.phone !== undefined) txt += `📱 Телефон: ${one.phone}`
		context.reply(txt)
	});
	vk.updates.hear(/^(?:.сказать)\s([^]+)$/i, async (msg) => {
		var mid = msg.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		tts(msg.$match[1], "ru", 1).then( function (url){
		msg.sendAudioMessage(url);
		}).catch( function (err){
			msg.reply(`Cлишком большое сообщение! [${msg.$match[1].length} > 200]`); // атшибка
		});
		   		vk.api.call("messages.delete", { message_ids: mid, delete_for_all: 1 }).catch((error) => {return;}); 
	});
	vk.updates.hear(/^(?:дата|время|)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		var str = ``;

		if(context.$match[1] == "Москва") {
			context.reply(`${profile[id].bot} Москва:\n${times(context.createdAt - 14400)}`)
		}
		if(context.$match[1] == "Новосибирск") {
			context.reply(`${profile[id].bot} Новосибирск:\n${times(context.createdAt)}`)
		}
		if(context.$match[1] == "Алматы") {
			context.reply(`${profile[id].bot} Алматы:\n${times(context.createdAt - 3600)}`)
		}
		if(context.$match[1] == "Рим") {
			context.reply(`${profile[id].bot} Рим:\n${times(context.createdAt - 18000)}`)
		}
		if(context.$match[1] == "Новошахтинск") {
			context.reply(`${profile[id].bot} Новошахтинск:\n${times(context.createdAt - 14400)}`)
		}
		if(context.$match[1] == "Армения") {
			context.reply(`${profile[id].bot} Армения:\n${times(context.createdAt - 10800)}`)
		}
		if(context.$match[1] == "Улан-Удэ") {
			context.reply(`${profile[id].bot} Улан-Удэ:\n${times(context.createdAt + 3600)}`)
		}
		if(context.$match[1] == "БД") {
			context.reply(`${profile[id].bot} БД:

		Москва:\n${times(context.createdAt - 14400)}

		Новосибирск:\n${times(context.createdAt)}

		Алматы:\n${times(context.createdAt - 3600)}

		Рим:\n${times(context.createdAt - 18000)}

		Новошахтинск:\n${times(context.createdAt - 14400)}

		Армения:\n${times(context.createdAt - 10800)}

		Улан-Удэ:\n${times(context.createdAt + 3600)}`)

		}
		} catch { context.reply(`${profile[id].bot} в БД нет такого города(`)}
	});
	vk.updates.hear(/^(?:сс|cc|сократить|сокр)\s([^]+)$/i, async (context) => {
		try {
			var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		var sil = await vk.api.utils.getShortLink({ url: `${context.$match[1]}`, private: 0 });
		vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, dont_parse_links: 1, keep_forward_messages: 1, message: `${profile[id].bot} сократил ссылку: -\n${sil.short_url}`});
		} catch { context.reply(`${profile[id].bot} ошибка!\n[${context.$match[1]}] - сократить невозможно!`)}
	});
	vk.updates.hear(/^(?:iris)$/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(player);
			if(player !== my_link) return;
		if(mid_from.items[0].reply_message == undefined) return context.send(`${profile[id].bot} вы не отвечаете на сообщение!⚠`)
		const message = mid_from.items[0].reply_message.from_id
		vk.api.messages.send({ peer_id: -182714165, message: `!check @id${message}`});
		test = context.peerId
		test2 = message
		test3 = mid
	});
	vk.updates.hear(/([^]+)/i, async (context) => {
		var mid = context.id
			var mid_from = await vk.api.messages.getById({ message_ids: mid});
			var player = mid_from.items[0].from_id
			var id = await SearchProfiles(my_link)
			if(context.peerId == -182714165) {
				const [user_info] = await vk.api.users.get({ user_ids: test2}); 
				var a = context.text.split('о дежурном')[0]
				if(a == "Такого дежурного нет!") return vk.api.messages.edit({ peer_id: test, message_id: test3, dont_parse_links: 1, keep_forward_messages: 1, message: `❌ @id${test2} (${user_info.first_name} ${user_info.last_name}) не является дежурным!`});
				if(a == "Информация ") {
				var txt = ``;
				var a = context.text.split('Логин:')[1].split('Автоонлайн:')[0].slice(1);
				var a1 = context.text.split('Автоудаление собак:')[0].split('Автоонлайн:')[1];
				var a2 = context.text.split('Автодобавление в друзья:')[0].split('Автоудаление собак:')[1];
				var a3 = context.text.split('Автоотписка от удалившихся друзей:')[0].split('Автодобавление в друзья:')[1];
				var a4 = context.text.split('Автоотписка от удалившихся друзей:')[1];
				txt += `👤 Информация о @id${test2} (${user_info.first_name} ${user_info.last_name}):\n`
				txt += `🆔 Цифровой ID: ${test2}\n\n`
				txt += `🎫 Логин: ${a}\n`
				if(a1 == 0) txt += `❌ Автоонлайн: @id${test2}(Выключен)\n`
				if(a1 == 1) txt += `✅ Автоонлайн: @id${test2}(Включен)\n`
				if(a2 == 0) txt += `❌ Автоудаление собак: @id${test2}(Выключено)\n`
				if(a2 == 1) txt += `✅ Автоудаление собак: @id${test2}(Включено)\n`
				if(a3 == 0) txt += `❌ Автодобавление в друзья: @id${test2}(Выключено)\n`
				if(a3 == 1) txt += `✅ Автодобавление в друзья: @id${test2}(Включено)\n`
				if(a4 == 0) txt += `❌ Автоотписка от удал. друзей: @id${test2}(Выключена)\n`
				if(a4 == 1) txt += `✅ Автоотписка от удал. друзей: @id${test2}(Включена)\n`
				txt += `\n💎 Информация взята с https://vk.com/iriscallback`
		vk.api.messages.edit({ peer_id: test, message_id: test3, dont_parse_links: 1, keep_forward_messages: 1, message: `${txt}`});
		test = my_link
		test2 = my_link
		test3 = 0
				}
			}
			if(player == my_link && profile[id].antimat == true) {
				let zaprets1 = context.$match[1].toLowerCase();
				var re = /(6ля|6лядь|6лять|b3ъeб|фак ю|хрен|cock|cunt|e6aль|ebal|eblan|eбaл|еба|ебу|eбaть|eбyч|eбать|eбёт|eблантий|fuck|fucker|fucking|xyёв|xyй|xyя|xуе,xуй|xую|zaeb|zaebal|zaebali|zaebat|архипиздрит|ахуел|ахуеть|бздение|бздеть|бздех|бздецы|бздит|бздицы|бздло|бзднуть|бздун|бздунья|бздюха|бздюшка|бздюшко|бля|блябу|блябуду|бляд|бляди|блядина|блядище|блядки|блядовать|блядство|блядун|блядуны|блядунья|блядь|блядюга|блять|вафел|вафлёр|взъебка|взьебка|взьебывать|въеб|въебался|въебенн|въебусь|въебывать|выблядок|выблядыш|выеб|выебать|выебен|выебнулся|выебон|выебываться|выпердеть|высраться|выссаться|вьебен|гавно|гавнюк|гавнючка|гамно|гандон|гнид|гнида|гниды|говенка|говенный|говешка|говназия|говнецо|говнище|говно|говноед|говнолинк|говночист|говнюк|говнюха|говнядина|говняк|говняный|говнять|гондон|доебываться|долбоеб|долбоёб|долбоящер|дрисня|дрист|дристануть|дристать|дристун|дристуха|дрочелло|дрочена|дрочила|дрочилка|дрочистый|дрочить|дрочка|дрочун|е6ал|е6ут|еб твою мать|ёб твою мать|ёбaн|ебaть|ебyч|ебал|ебало|ебальNICK|ебан|ебанамать|ебанат|ебаная|ёбаная|ебанический|ебанный|ебанныйврот|ебаное|ебануть|ебануться|ёбаную|ебаный|ебанько|ебарь|ёбат|ебатория|ебать|ебать-копать|ебаться|ебашить|ебёна|ебет|ебёт|ебец|ебик|ебин|ебись|ебическая|ебки|ебла|еблан|ебливый|еблище|ебло|еблыст|ебля|ёбн|ебнуть|ебнуться|ебня|ебошить|ебская|ебский|ебтвоюмать|ебун|ебут|ебуч|ебуче|ебучее|ебучий|ебучим|ебущ|ебырь|елда|елдак|елдачить|жопа|жопу|заговнять|задрачивать|задристать|задрота|зае6|заё6|заеб|заёб|заеба|заебал|заебанец|заебастая|заебастый|заебать|заебаться|заебашить|заебистое|заёбистое|заебистые|заёбистые|заебистый|заёбистый|заебись|заебошить|заебываться|залуп|залупа|залупаться|залупить|залупиться|замудохаться|запиздячить|засерать|засерун|засеря|засирать|засрун|захуячить|заябестая|злоеб|злоебучая|злоебучее|злоебучий|ибанамат|ибонех|изговнять|изговняться|изъебнуться|ипать|ипаться|ипаццо|Какдвапальцаобоссать|конча|курва|курвятNICK|лошарa|лошара|лошары|лошок|лярва|малафья|мандавошек|мандавошка|мандавошки|мандей|мандень|мандеть|мандища|мандой|манду|мандюк|минет|минетчик|минетчица|млять|мокрощелка|мокрощёлка|мразь|мудak|мудaк|мудаг|мудак|муде|мудель|мудеть|муди|мудил|мудила|мудистый|мудня|мудоеб|мудозвон|мудоклюй|на хер|на хуй|набздел|набздеть|наговнять|надристать|надрочить|наебать|наебет|наебнуть|наебнуться|наебывать|напиздел|напиздели|напиздело|напиздили|насрать|настопиздить|нахер|нахрен|нахуй|нахуйNICK|не ебет|не ебёт|невротебучий|невъебенно|нехира|нехрен|Нехуй|нехуйственно|ниибацо|ниипацца|ниипаццо|ниипет|NICKуя|нихера|нихуя|обдристаться|обосранец|обосрать|обосцать|обосцаться|обсирать|объебос|обьебать обьебос|однохуйственно|опездал|опизде|опизденивающе|остоебенить|остопиздеть|отмудохать|отпиздить|отпиздячить|отпороть|отъебись|охуевательский|охуевать|охуевающий|охуел|охуенно|охуеньчик|охуеть|охуительно|охуительный|охуяньчик|охуячивать|охуячить|очкун|падла|падонки|падонок|паскуда|педерас|педик|педрик|педрила|педрилло|педрило|педрилы|пездень|пездит|пездишь|пездо|пездят|пердануть|пердеж|пердение|пердеть|пердильNICK|перднуть|пёрднуть|пердун|пердунец|пердунина|пердунья|пердуха|пердь|переёбок|пернуть|пёрнуть|пи3д|пи3де|пи3ду|пиzдец|пидар|пидарaс|пидарас|пидарасы|пидары|пидор|пидорасы|пидорка|пидорок|пидоры|пидрас|пизда|пиздануть|пиздануться|пиздарваньчик|пиздато|пиздатое|пиздатый|пизденка|пизденыш|пиздёныш|пиздеть|пиздец|пиздит|пиздить|пиздиться|пиздишь|пиздища|пиздище|пиздобол|пиздоболы|пиздобратия|пиздоватая|пиздоватый|пиздолиз|пиздонутые|пиздорванец|пиздорванка|пиздострадатель|пизду|пиздуй|пиздун|пиздунья|пизды|пиздюга|пиздюк|пиздюлина|пиздюля|пиздят|пиздячить|писбшки|писька|писькострадатель|писюн|писюшка|по хуй|по хую|подговнять|подонки|подонок|подъебнуть|подъебнуться|поебать|поебень|поёбываает|поскуда|посрать|потаскуха|потаскушка|похер|похерил|похерила|похерили|похеру|похрен|похрену|похуй|похуист|похуистка|похую|придурок|приебаться|припиздень|припизднутый|припиздюлина|пробзделся|проблядь|проеб|проебанка|проебать|промандеть|промудеть|пропизделся|пропиздеть|пропиздячить|раздолбай|разхуячить|разъеб|разъеба|разъебай|разъебать|распиздай|распиздеться|распиздяй|распиздяйство|распроеть|сволота|сволочь|сговнять|секель|серун|серька|сестроеб|сикель|сирать|сирывать|соси|спиздел|спиздеть|спиздил|спиздила|спиздили|спиздит|спиздить|срака|сраку|сраный|сранье|срать|срун|ссака|ссышь|стерва|страхопиздище|сука|суки|суходрочка|сучара|сучий|сучка|сучко|сучонок|сучье|сцание|сцать|сцука|сцуки|сцуконах|сцуль|сцыха|сцышь|съебаться|сыкун|трахае6|трахаеб|трахаёб|трахатель|ублюдок|уебать|уёбища|уебище|уёбище|уебищное|уёбищное|уебк|уебки|уёбки|уебок|уёбок|урюк|усраться|ушлепок|х_у_я_р_а|хyё|хyй|хyйня|хамло|хер|херня|херовато|херовина|херовый|хитровыебанный|хитрожопый|хуeм|хуе|хуё|хуевато|хуёвенький|хуевина|хуево|хуевый|хуёвый|хуек|хуёк|хуел|хуем|хуенч|хуеныш|хуенький|хуеплет|хуеплёт|хуепромышленNICK|хуерик|хуерыло|хуесос|хуесоска|хуета|хуетень|хуею|хуи|хуй|хуйком|хуйло|хуйня|хуйрик|хуище|хуля|хую|хуюл|хуя|хуяк|хуякать|хуякнуть|хуяра|хуясе|хуячить|целка|чмо|чмошNICK|чмырь|шалава|шалавой|шараёбиться|шлюха|шлюхой|шлюшка|ябывает)/gi;
				var str = `${context.$match[1]}`;
				if(re.test(zaprets1) == true) {
					var newstr = str.replace(re, `${profile[id].antimat_text}`);
					vk.api.messages.edit({ peer_id: context.peerId, message_id: mid, keep_forward_messages: 1, message: `${newstr}`});
				}
			}
		if(context.$match[1] == ".пинг" || context.$match[1] == ".Пинг") {
		let otvet = ((new Date().getTime() - (context.createdAt * 1000)) / 1000).toFixed(2)
		if(player == my_link) context.reply(`${profile[id].bot} понг!\n\nОтвет занял ${otvet} 𝕤𝕖𝕔𝕠𝕟𝕕.`)
		}
		if(context.$match[1] == ".кинг" || context.$match[1] == ".Кинг") {
		let otvet = ((new Date().getTime() - (context.createdAt * 1000)) / 1000).toFixed(2)
		if(player == my_link) context.reply(`${profile[id].bot} конг!\n\nОтвет занял ${otvet} 𝕤𝕖𝕔𝕠𝕟𝕕.`)
		}
		if(context.$match[1] == ".пиу" || context.$match[1] == ".пиу") {
		let otvet = ((new Date().getTime() - (context.createdAt * 1000)) / 1000).toFixed(2)
		if(player == my_link) context.reply(`${profile[id].bot} пау!\n\nОтвет занял ${otvet} 𝕤𝕖𝕔𝕠𝕟𝕕.`)
		}
		if(context.$match[1] == ".пиу-пиу" || context.$match[1] == ".Пиу-пиу" || context.$match[1] == ".Пиу-Пиу") {
		let otvet = ((new Date().getTime() - (context.createdAt * 1000)) / 1000).toFixed(2)
		if(player == my_link) context.reply(`${profile[id].bot} Пау-Пау!\n\nОтвет занял ${otvet} 𝕤𝕖𝕔𝕠𝕟𝕕.`)
		}
});
}
