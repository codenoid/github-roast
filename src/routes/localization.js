/** @type { Record<string, { name: string, buildPrompt: (username: string, data: any) => string } } */
const languages = {
	english: {
		name: "English",
		buildPrompt(username, data) {
			return `give a short and harsh roasting for the following github profile: ${username}. Here are the details: "${JSON.stringify(data)}"`;
		}
	},
	france: {
		name: "France",
		buildPrompt(username, data) {
			return `fais une courte et cruelle critique sarcastique en argot pour le profil GitHub suivant : ${username}. Voici les détails : "${JSON.stringify(data)}"`;
		}
	},
	italian: {
		name: "Italian",
		buildPrompt(username, data) {
			return `Criticami in modo sarcastico il seguente profilo GitHub: ${username}. Ecco alcuni dettagli: "${JSON.stringify(data)}"`;
		}
	},
	indonesian: {
		name: "Indonesian",
		buildPrompt(username, data) {
			return `gunakan bahasa indonesia yang normal seperti manusia gaul, berikan roasting singkat dengan kejam dan menyindir dalam bahasa gaul untuk profile github berikut : ${username}. Berikut detailnya: "${JSON.stringify(data)}"`;
		}
	},
	indian: {
		name: "Hindi",
		buildPrompt(username, data) {
			return `इस गिटहब प्रोफाइल के लिए एक क्रूर और व्यंग्यात्मक रोस्टिंग गली भाषा में दें: ${username}। विवरण इस प्रकार है: "${JSON.stringify(data)}"`;
		}
	},
	korean: {
		name: "Korean",
		buildPrompt(username, data) {
			return `다음 GitHub 프로필에 대해 잔인하고 비꼬는 짧은 로스팅을 속어로 해주세요: ${username}. 자세한 내용은 다음과 같습니다: "${JSON.stringify(data)}"`;
		}
	},
	japanese: {
		name: "Japanese",
		buildPrompt(username, data) {
			return `以下のGitHubプロフィールに対して残酷で皮肉な短いローストをギャル語でしてください: ${username}。詳細は次の通りです: "${JSON.stringify(data)}"`;
		}
	},
	chinese: {
		name: "Chinese",
		buildPrompt(username, data) {
			return `用中文俚语对以下GitHub个人资料进行短暂而残酷的讽刺：${username}。以下是详细信息: "${JSON.stringify(data)}"`;
		}
	},
	german: {
		name: "German",
		buildPrompt(username, data) {
			return `machen sie eine grausame, kurze, harte und sarkastische Röstung auf Deutsch und verwenden Sie Wortspiele und Slang, um Humor in das folgende Github-Profil zu bringen : ${username}. Hier sind die Details : "${JSON.stringify(data)}"`
		}
	},
	arabic: {
		name: "Arabic",
		buildPrompt(username, data) {
			return `.${JSON.stringify(data)}: اليك هذه التفصيل .${username} :(GitHub) قدم سخرية قصيرة و قاصية على الملف الشخصي في`;
		}
	},
	vietnamese: {
		name: "Vietnamese",
		buildPrompt(username, data) {
			return `Hãy đưa ra một lời châm chọc ngắn gọn và tàn nhẫn bằng tiếng lóng cho hồ sơ GitHub sau: ${username}. Đây là chi tiết: "${JSON.stringify(data)}"`;
		}
	},
	finnish: {
		name: "Finnish",
		buildPrompt(username, data) {
			return `Kirjoita lyhyt, julma ja sarkastinen arvostelu slangilla seuraavalle Github-profiilille: ${username}. Tässä on profiilin yksityiskohdat: "${JSON.stringify(data)}"`;
		}
	},
	portuguese: {
		name: "Portuguese",
		buildPrompt(username, data) {
			return `faça uma crítica curta e dura para o seguinte perfil do github: ${username}. Aqui estão os detalhes: "${JSON.stringify(data)}"`;
		}
	},
	polish: {
		name: "Polish",
		buildPrompt(username, data) {
			return `krótko i ostro skrytykuj poniższy profil GitHub: ${username}. Oto szczegóły: "${JSON.stringify(data)}"`;
		}
	},
}

export { languages };