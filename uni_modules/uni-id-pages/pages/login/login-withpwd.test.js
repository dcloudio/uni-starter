// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.io/collocation/auto/hbuilderx-extension/index
const PAGE_PATH = '/uni_modules/uni-id-pages/pages/login/login-withpwd'
describe('login-withpwd', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
	});
	it('账号密码登录', async () => {
		await page.setData({
			"username": "DCloud",
			"password": "dcloud2022",
			// "password": "unistarter2022",
			// "captcha":"1234",
			"agree": true,
			"isTest":true
		})
		const needCaptcha = await page.data('needCaptcha')
		if(needCaptcha){
			await page.setData({
				"captcha":"1234"
			})
		}
		const resLogin = await page.callMethod('pwdLogin')
		console.log("resLogin: ", resLogin.errCode);
		expect.assertions(1);
		switch (resLogin.errCode){
			case 0:
				expect(resLogin.uid).toHaveLength(24);
				break;
			case "uni-id-account-not-exists":
				const expectAccountStr = ["此账号未注册","Account does not exists"]
				expect(expectAccountStr).toContain(resLogin.errMsg);
				await page.callMethod('toRegister')
				break;
			case "uni-id-password-error":
				const expectPasswordStr = ["密码错误","Password error"]
				expect(expectPasswordStr).toContain(resLogin.errMsg);
				await page.setData({
					"username": "DCloud",
					"password": "dcloud2022",
					// "password": "unistarter2022",
					"agree": true,
				})
				await page.callMethod('pwdLogin')
				break;
			case "uni-id-captcha-required":
				const expectCaptchaStr = ["请输入图形验证码","Captcha required"]
				expect(expectCaptchaStr).toContain(resLogin.errMsg);
				await page.setData({
					"captcha":"1234"
				})
				const resLoginaa = await page.callMethod('pwdLogin')
				if(resLoginaa.errCode == 0){
					console.log('登录成功');
				}else{
					await page.setData({
						"username": "DCloud",
						"password": "dcloud2022",
						"captcha":"1234",
						"agree": true
					})
					await page.callMethod('pwdLogin')
				}
				break;
			case "uni-captcha-verify-fail":
				expect(resLogin.errMsg).toBe("验证码错误");
				break;
			case 10103:
				expect(resLogin.errMsg).toBe("密码错误次数过多");
				break;
			case 10002:
				expect(resLogin.errMsg).toBe("验证码不可为空");
				break;
			case "SYS_ERR":
				console.log("未知错误---SYS_ERR",resLogin)//[uni-id-co]: request:fail
				break;
			default:
				console.log(await program.currentPage());
				break;
		}
		await page.waitFor(300)
	})
});
