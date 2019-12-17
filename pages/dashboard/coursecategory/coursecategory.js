var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
	data: {
		CustomBar: app.globalData.CustomBar,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        list: [{
			id: 0,
            category: '国画',
            content: [{
                name: '齐白石基础班',
                jxduixiang: '教学对象：建议年龄5~7岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：通过生动有趣的课程体验，让孩子体验国画中线条的变化多端，墨色丰富多彩，水墨渗化的奇妙无穷，教会孩子学习认知方法，观察方法，思考方法。',
                other: '绘画内容：创意果蔬'
            }, {
                name: '娄师白花卉山水班',
                jxduixiang: '教学对象：建议年龄7~8岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：通过系统地讲解了少儿花卉山水国画的表现技法，绘画过程中让孩子了解笔、宣纸、墨、水四者之间的关系。培养少年儿童的形象思维能力及艺术审美能力。',
                other: '绘画内容:花卉，二十四节气，山水'
            }, {
                name: '具象主义花鸟昆虫班',
                jxduixiang: '教学对象：建议年龄8~9岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学内容：基础技法上的学习，花鸟的基本功是笔墨，题目的锻炼从梅兰竹菊入手，等有了一定的笔墨基础，结合已经学过的昆虫、鸟组成完整的一幅画。',
                other: ''
            }, {
                name: '恽寿平没骨班',
                jxduixiang: '教学对象：建议年龄9~10岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学内容：没骨花鸟画是介于工笔花鸟画和写意花鸟画之间的一种绘画形式，通过没骨画法的学习，让孩子理解没骨画是将墨，色，水，笔融于一体，将运笔和设色有机的融合在一起。',
                other: ''
            }, {
                name: '工笔班',
                jxduixiang: '教学对象：建议年龄10岁以上',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学内容：工笔画在古代视为宫庭画，特点是以写实为主，欣赏性很强，工序复杂，画工精细，让孩子学习工笔画不仅能养成心静、学习认真的良好习惯，还能培养儿童养成耐心细致、持之以恒的做事态度。',
                other: ''
            }]
        }, {
				id: 1,
            category: '西画',
            content: [{
                name: '米罗创意班',
                jxduixiang: '教学对象：建议年龄5~7岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：通过生动有趣的课程体验，让孩子充分感知绘画的趣味性，在实际课程中发现线，形，色的美，增强对各种线的熟悉，开始具有对各种形的组合构成的意识，培养孩子创意思维习惯。',
                other: '绘画形式：蜡笔画、综合材料画、丙烯画、水彩画、轻黏土画、手指画、马克笔画。'
            }, {
                name: '立体主义班',
                jxduixiang: '教学对象：建议年龄7~8岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：增强专业性，深入美术技巧学习，提高审美技能水平，拓展学生的艺术视野。',
                other: '绘画形式：素描、丙烯画、水彩笔、马克笔画、色粉笔画、彩铅画、动漫人物画'
            }, {
                name: '表现主义班',
                jxduixiang: '教学对象：建议年龄8~9岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：提升专业性的塑造，拓展学生的艺术视野，了解艺术的多元化与丰富性，学习不同艺术门类的不同艺术语言，提升审美水平和艺术知识。',
                other: '绘画形式：素描、水彩画、丙烯画、马克笔画、色粉笔画、彩铅画'
            }, {
                name: '专业技巧班',
                jxduixiang: '教学对象：建议年龄9~10岁',
                shichang: '课时时长：1.5小时/节',
                jxmubiao: '教学目标：艺术专业阶段课程设置符合艺术院校基本专业课程，增强专业性的训练，深入美术技巧学习，提高审美，技能水平',
                other: '绘画形式：速写（静物、风景、石膏像、人物），素描（静物、石膏像、人物），水粉（静物、人物）……'
            }]
        }, {
				id: 2,
				category: '硬笔',
				content: [{
					name: '铅笔班（规范书写，焕然一新）',
					jxduixiang: '教学对象：建议年龄6~8岁',
					shichang: '课时时长：1.5小时/节',
					jxmubiao: '教学目标：以端正孩子的握笔姿势和坐姿，养成良好的书写习惯。运用写字操让书法课堂更加灵活、生动，调动孩子书写积极性。从最基本的笔画开始学起，让孩子打下扎实的基础。每节课根据不同的笔画配有特色主题引导，课题新颖，大胆创新，形象生动。锻炼孩子单字书写的能力，规范笔顺、字形及用笔变化，让孩子的字在书写过程中焕然一新。',
					other: ''
				}, {
						name: '硬笔班（心正笔正，行云流水）',
					jxduixiang: '教学对象：建议年龄7~15岁',
					shichang: '课时时长：1.5小时/节',
						jxmubiao: '教学目标：让孩子掌握正确的握笔姿势和坐姿，养成良好的书写习惯。运用多体验式互动教学让书法课堂更加形象化、多元化，调动孩子书写积极性。从最基本的笔画开始学起，让孩子打下扎实的基础。每节课根据不同的笔画配有特色主题引导，课题新颖，大胆创新。穿插结构讲解，使字体开始出现书法美感。锻炼孩子连续书写的能力，将书写的速度与美感有效的结合，让孩子的字在学习中收获满满。',
						other: ''
				}]
        }, {
				id: 3,
				category: '软笔',
				content: [{
					name: '软笔班（笔精墨妙，云烟满纸）',
					jxduixiang: '教学对象：建议年龄6~8岁',
					shichang: '课时时长：1.5小时/节',
					jxmubiao: '教学目标：让孩子掌握毛笔的正确握笔姿势，以颜真卿著名碑帖《颜勤礼碑》入手，学习颜体的基本笔画，了解颜体的基本特点，让孩子们在学习中里感受到提笔挥墨的乐趣。',
					other: ''
				}]
			}],
		load: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    VerticalMain(e) {
        let that = this;
        let list = this.data.list;
        let tabHeight = 0;
        if (this.data.load) {
            for (let i = 0; i < list.length; i++) {
				let view = wx.createSelectorQuery().select("#main-" + list[i].id);
                view.fields({
                    size: true
                }, data => {
                    list[i].top = tabHeight;
                    tabHeight = tabHeight + data.height;
                    list[i].bottom = tabHeight;
                }).exec();
            }
            that.setData({
                load: false,
                list: list
            })
        }
        let scrollTop = e.detail.scrollTop + 20;
        for (let i = 0; i < list.length; i++) {
            if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                that.setData({
                    VerticalNavTop: (list[i].id - 1) * 50,
                    TabCur: list[i].id
                })
                return false
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})