jest.setTimeout(20000)
describe('grid', () => {
	let page, hasLogin;
	beforeAll(async () => {
		page = await program.switchTab('/pages/grid/grid')
		await page.waitFor('view')
    if(process.env.UNI_PLATFORM === "mp-weixin"){
      await page.waitFor(5000)
    }else{
      await page.waitFor(2000)
    }
	})
  it('检测banner', async () => {
    // 等待图片显示完成
    await page.waitFor(5000)
    const images = await page.$$('.banner-image')
    expect(images.length).toBe(2)
    const src = await images[0].property('src')
    expect(src).toBe('https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg')
  })
  it('检测宫格', async () => {
    hasLogin = await page.data('hasLogin')
    const grids = await page.$$('.text')
    if(hasLogin){
      expect(grids.length).toBe(6)
      expect(await grids[3].text()).toBe('登录可见')
    }else{
      expect(grids.length).toBe(3)
    }
    expect(await grids[0].text()).toBe('所有人可见')
  })
	it('点击宫格', async () => {
		const perPage = await page.$$('.grid-item-box')
		for (var i = 0; i < perPage.length; i++) {
			await perPage[i].tap()
			await page.waitFor(300)
		}
	})
});