addLayer("p", {
    name: "完成的题目", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "orange",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "完成的题目", // Name of prestige currency
    baseResource: "思路", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('p',24)) mult=mult.mul(upgradeEffect('p',24))
        if(hasUpgrade('p',31)) mult=mult.mul(upgradeEffect('p',31))
        if(hasUpgrade('r', 11)) mult=mult.mul(upgradeEffect('r',11))
        if(hasUpgrade('c', 11)) mult=mult.mul(upgradeEffect('c',11))
        if(hasUpgrade('g', 11)) mult=mult.mul(upgradeEffect('g',11))
        if(hasUpgrade('d', 11)) mult=mult.mul(upgradeEffect('d',11))
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: 重置以获得完成的题目", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades:{
        11:{
            title: "故事的开始",
            description: "每秒获得 1 思路。",
            cost: new Decimal(1)
        },
        12:{
            title: "另一个升级",
            description: "每秒多获得 1 思路。",
            unlocked(){return hasUpgrade('p', 11)},
            cost: new Decimal(1)
        },
        13:{
            title: "第三个升级",
            description: "每秒再多获得 1 思路。",
            unlocked(){return hasUpgrade('p', 12)},
            cost: new Decimal(1)
        },
        14:{
            title: "别+1了",
            description: "每秒多获得 1 思路——最后一次。",
            unlocked(){return hasUpgrade('p', 13)},
            cost: new Decimal(2)
        },
        21:{
            title: "另一个开始",
            description: "每秒获得的思路翻倍，",
            unlocked(){return hasUpgrade('p', 14)},
            cost: new Decimal(3)
        },
        22:{
            title: "警告：无限膨胀",
            description: "根据当前完成的题目数，每秒获得更多思路。",
            unlocked(){return hasUpgrade('p', 21)},
            effect(){return player[this.layer].points.add(1).pow(0.3)},
            effectDisplay(){return hasUpgrade('p', 22)?format(upgradeEffect('p',22))+'x':'1x'},
            cost: new Decimal(5)
        },
        23:{
            title: "但是没有完全膨胀",
            description: "根据当前的思路数，每秒获得更多思路。",
            unlocked(){return hasUpgrade('p', 22)},
            effect(){return player.points.add(1).pow(0.2)},
            effectDisplay(){return hasUpgrade('p', 23)?format(upgradeEffect('p',23))+'x':'1x'},
            cost: new Decimal(10)
        },
        24:{
            title: "或许膨胀了",
            description: "根据当前的思路数，重置时获得更多完成的题目。",
            unlocked(){return hasUpgrade('p', 23)},
            effect(){return player.points.add(1).pow(0.2)},
            effectDisplay(){return hasUpgrade('p', 24)?format(upgradeEffect('p',24))+'x':'1x'},
            cost: new Decimal(25)
        },
        31:{
            title: "元升级",
            description: "根据当前完成的题目数，重置时获得更多完成的题目。",
            unlocked(){return hasUpgrade('p', 24)},
            effect(){return player[this.layer].points.add(1).log2().add(1).pow(0.8)},
            effectDisplay(){return hasUpgrade('p', 31)?format(upgradeEffect('p',31))+'x':'1x'},
            cost: new Decimal(80)
        },
        32:{
            title: "最终升级",
            description: "解锁接下来两个层级。",
            unlocked(){return hasUpgrade('p', 31)},
            cost: new Decimal(500)
        },
        41:{
            title: "传奇解题家",
            description: "获得橙色钥匙。",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e40)
        }
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasAchievement('a',24)) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('p', keep);
        if(resettingLayer=='r')
        {
            if(hasMilestone('r',0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
            if(hasMilestone('r',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21,22,23,24]);
            if(hasMilestone('r',2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
        }
        if(resettingLayer=='c')
        {
            if(hasMilestone('c',0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
            if(hasMilestone('c',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21,22,23,24]);
            if(hasMilestone('c',2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
        }
        };
    },
    passiveGeneration(){
        ret=0
        if(hasMilestone('c',3)) ret+=0.25
        if(hasMilestone('r',3)) ret+=0.25
        return ret
    }
})
addLayer("r", {
    name: "评分", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['p'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "green",
    requires: ()=>{return !hasAchievement('a',31)&&hasMilestone('c',0)&&!hasMilestone('r',1)?new Decimal(1e5):new Decimal(2000)}, // Can be a function that takes requirement increases into account
    resource: "评分", // Name of prestige currency
    baseResource: "思路", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base:1.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('c',13)) mult=mult.div(upgradeEffect('c',13))
        if(hasUpgrade('r',12)) mult=mult.div(upgradeEffect('r',12))
        if(hasUpgrade('g',12)) mult=mult.div(upgradeEffect('g',12))
        if(hasUpgrade('d',12)) mult=mult.div(upgradeEffect('d',12))
        if(hasUpgrade('pc',12)) mult=mult.div(upgradeEffect('pc',12))
        if(hasAchievement('a',41)) mult=mult.div(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: 重置以获得评分", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones:{
        0: {
            requirementDescription: "1 评分",
            effectDescription: "在评分重置时保留第一行题目升级。",
            done() { return player.r.points.gte(1) }
        },
        1: {
            requirementDescription: "2 评分",
            effectDescription: "在评分重置时保留第二行题目升级，且这个层级视为第一个解锁。",
            done() { return player.r.points.gte(2) }
        },
        2: {
            requirementDescription: "4 评分",
            effectDescription: "在评分重置时保留第三行题目升级。",
            done() { return player.r.points.gte(4) }
        },
        3: {
            requirementDescription: "6 评分",
            effectDescription: "每秒获得重置可获得的完成的题目的 25%。",
            done() { return player.r.points.gte(6) }
        }
    },
    layerShown(){return hasUpgrade('p',32)||hasMilestone('r',0)||hasAchievement('a',24)},
    upgrades:{
        11:{
            title: "更多的训练",
            description: "根据当前的评分，每秒/重置时获得更多完成的题目和思路。",
            effect(){return player.r.points.add(1).pow(1.2)},
            effectDisplay(){return hasUpgrade('r', 11)?format(upgradeEffect('r',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "更更多的训练",
            description: "根据当前的评分，重置时获得更多评分。",
            effect(){return player.r.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('r', 12)?format(upgradeEffect('r',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "更更更多的训练",
            description: "根据当前的评分，重置时获得更多完成的比赛。",
            effect(){return player.r.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('r', 13)?format(upgradeEffect('r',13))+'x':'1x'},
            cost: new Decimal(6)
        },
        14:{
            title: "无穷训练",
            description: "获得绿色钥匙。",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(36)
        },
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasMilestone('g',0)||(hasMilestone('pc',0)&&resettingLayer=='pc')) keep.push("milestones");
        if (hasMilestone('g',1)||(hasMilestone('pc',1)&&resettingLayer=='pc')) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('r', keep);};
    },
    resetsNothing(){return hasMilestone('g',2);},
    autoPrestige(){return hasMilestone('g',2);},
    canBuyMax(){
        return hasMilestone('g',3)
    }
})
addLayer("c", {
    name: "完成的比赛", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['p'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "red",
    requires: ()=>{return !hasAchievement('a',31)&&hasMilestone('r',0)&&!hasMilestone('c',1)?new Decimal(5e4):new Decimal(1500)}, // Can be a function that takes requirement increases into account
    resource: "完成的比赛", // Name of prestige currency
    baseResource: "完成的题目", // Name of resource prestige is based on
    baseAmount() {return player['p'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('r',13)) mult=mult.mul(upgradeEffect('r',13))
        if(hasUpgrade('c',12)) mult=mult.mul(upgradeEffect('c',12))
        if(hasUpgrade('g',12)) mult=mult.mul(upgradeEffect('g',12))
        if(hasUpgrade('d',12)) mult=mult.mul(upgradeEffect('d',12))
        if(hasUpgrade('pc',12)) mult=mult.mul(upgradeEffect('pc',12))
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: 重置以获得完成的比赛", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones:{
        0: {
            requirementDescription: "1 完成的比赛",
            effectDescription: "在比赛重置时保留第一行题目升级",
            done() { return player.c.points.gte(1) }
        },
        1: {
            requirementDescription: "3 完成的比赛",
            effectDescription: "在比赛重置时保留第二行题目升级，且这个层级视为第一个解锁。",
            done() { return player.c.points.gte(3) }
        },
        2: {
            requirementDescription: "5 完成的比赛",
            effectDescription: "在比赛重置时保留第三行题目升级",
            done() { return player.c.points.gte(5) }
        },
        3: {
            requirementDescription: "10 完成的比赛",
            effectDescription: "每秒获得重置可获得的完成的题目的 25%。",
            done() { return player.c.points.gte(10) }
        }
    },
    layerShown(){return hasUpgrade('p',32)||hasMilestone('c',0)||hasAchievement('a',24)},
    upgrades:{
        11:{
            title: "通过一场比赛",
            description: "根据当前完成的比赛，每秒/重置时获得更多完成的题目和思路。",
            effect(){return player.c.points.pow(0.5).add(1)},
            effectDisplay(){return hasUpgrade('c', 11)?format(upgradeEffect('c',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "通过更多比赛",
            description: "根据当前完成的比赛，重置时获得更多完成的比赛。",
            effect(){return player.c.points.add(1).log2().add(1).pow(0.8)},
            effectDisplay(){return hasUpgrade('c', 12)?format(upgradeEffect('c',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "通过越来越多的比赛",
            description: "根据当前完成的比赛，重置时获得更多评分。",
            effect(){return player.c.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('c', 13)?format(upgradeEffect('c',13))+'x':'1x'},
            cost: new Decimal(15)
        },
        14:{
            title: "通过所有比赛",
            description: "获得红色钥匙。",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e15)
        },
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasMilestone('d',0)||(hasMilestone('pc',0)&&resettingLayer=='pc')) keep.push("milestones");
        if (hasMilestone('d',1)||(hasMilestone('pc',1)&&resettingLayer=='pc')) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('c', keep);};
    },
    passiveGeneration()
    {
        c=0
        if(hasMilestone('d',2)) c+=1
        if(hasMilestone('pc',2)) c+=1
        return c
    },
})
addLayer("g", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    branches:['r'],
position: 0,
    color: "blue",                       // The color for this layer, which affects many elements.
    resource: "咕值",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "评分",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.r.points },  // A function to return the current amount of baseResource.

    requires(){
        if(hasAchievement('a',34)) return new Decimal(10);
        if(hasMilestone('pc',0)) return hasMilestone('d',0)?new Decimal(15):new Decimal(13);
        else return hasMilestone('d',0)?new Decimal(14):new Decimal(10);
    },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 3,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    hotkeys: [
        {key: "g", description: "G: 重置以获得咕值", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown() { return hasAchievement('a',22) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "我蓝名了",
            description: "根据当前的咕值，每秒/重置时获得更多完成的题目和思路。",
            effect(){return player.g.points.add(1).pow(0.7)},
            effectDisplay(){return hasUpgrade('g', 11)?format(upgradeEffect('g',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "我绿名了",
            description: "前一个升级也影响评分和完成的比赛，但是效果稍弱。",
            effect(){return upgradeEffect('g',11).pow(0.7)},
            effectDisplay(){return hasUpgrade('g', 12)?format(upgradeEffect('g',12))+'x':'1x'},
            cost: new Decimal(4)
        },
        13:{
            title: "我红名了",
            description: "获得蓝色钥匙。",
            unlocked(){return hasAchievement('a', 24)},
            cost: new Decimal(300)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 咕值",
            effectDescription: "在所有重置中保留评分里程碑。",
            done() { return player.g.points.gte(1) }
        },
        1: {
            requirementDescription: "3 咕值",
            effectDescription: "在所有重置中保留评分升级。",
            done() { return player.g.points.gte(3) }
        },
        2: {
            requirementDescription: "4 咕值",
            effectDescription: "评分重置时不重置任何内容，且自动进行评分重置。",
            done() { return player.g.points.gte(4) }
        },
        3: {
            requirementDescription: "25 咕值",
            effectDescription: "评分重置时可以获得最大评分。",
            done() { return player.g.points.gte(25) }
        },
    }
})
addLayer("pc", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol:'PC',
    branches:['r','c'],
position: 1,
    color: "yellow",                       // The color for this layer, which affects many elements.
    resource: "创造的题目",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "完成的题目",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    hotkeys: [
        {key: "P", description: "Shift+P : 重置以获得创造的题目", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    requires(){
        if(hasAchievement('a',34)) return new Decimal(2e8);
        if(hasMilestone('g',0)) return hasMilestone('d',0)?new Decimal(1e23):new Decimal(1e11);
        else return hasMilestone('d',0)?new Decimal(1e17):new Decimal(2e8);
    },               // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.2,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() {return hasAchievement('a',25) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "新手出题人",
            description: "根据当前创造的题目，每秒/重置时获得更多完成的题目和思路。",
            effect(){return player.pc.points.add(1).pow(0.4)},
            effectDisplay(){return hasUpgrade('pc', 11)?format(upgradeEffect('pc',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "出题大师",
            description: "前一个升级也影响评分和完成的比赛，但是效果稍弱。",
            effect(){return upgradeEffect('pc',11).pow(0.4)},
            effectDisplay(){return hasUpgrade('pc', 12)?format(upgradeEffect('pc',12))+'x':'1x'},
            cost: new Decimal(5)
        },
        13:{
            title: "毒瘤题制造机",
            description: "获得黄色钥匙。",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e6)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 创造的题目",
            effectDescription: "在创造题目重置中保留评分和比赛里程碑。",
            done() { return player.pc.points.gte(1) }
        },
        1: {
            requirementDescription: "5 创造的题目",
            effectDescription: "在创造题目重置中保留评分和比赛升级。",
            done() { return player.pc.points.gte(5) }
        },
        2: {
            requirementDescription: "15 创造的题目",
            effectDescription: "每秒获得重置可获得的完成的比赛的 100%。",
            done() { return player.pc.points.gte(15) }
        },
    },
})
addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol:'D',
    branches:['c'],
position: 2,
    color: "pink",                       // The color for this layer, which affects many elements.
    resource: "提出的讨论",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "完成的比赛",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.c.points },  // A function to return the current amount of baseResource.

    hotkeys: [
        {key: "d", description: "D :重置以获得提出的讨论", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    requires(){
        if(hasAchievement('a',34)) return new Decimal(1500);
        if(hasMilestone('g',0)) return hasMilestone('pc',0)?new Decimal(5e6):new Decimal(30000);
        else return hasMilestone('pc',0)?new Decimal(5e5):new Decimal(1500);
    },                 // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.7,base:1.2,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.div(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() {return hasAchievement('a',25) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "讨论可以变强",
            description: "根据当前提出的讨论，每秒/重置时获得更多完成的题目和思路。",
            effect(){return player.d.points.add(1).pow(0.7)},
            effectDisplay(){return hasUpgrade('d', 11)?format(upgradeEffect('d',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "变强需要讨论",
            description: "前一个升级也影响评分和完成的比赛，但是效果稍弱。",
            effect(){return upgradeEffect('d',11).pow(0.7)},
            effectDisplay(){return hasUpgrade('d', 12)?format(upgradeEffect('d',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "知名讨论者",
            description: "获得粉色钥匙。",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1000)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 提出的讨论",
            effectDescription: "在所有重置中保留完成比赛的里程碑。",
            done() { return player.d.points.gte(1) }
        },
        1: {
            requirementDescription: "2 提出的讨论",
            effectDescription: "在所有重置中保留完成比赛的升级。",
            done() { return player.d.points.gte(2) }
        },
        2: {
            requirementDescription: "3 提出的讨论",
            effectDescription: "每秒获得重置可获得的完成的比赛的 100%",
            done() { return player.d.points.gte(3) }
        },
        3: {
            requirementDescription: "4 提出的讨论",
            effectDescription: "讨论重置时可以获得最大提出的讨论。",
            done() { return player.d.points.gte(4) }
        },
    },
    canBuyMax(){
        return hasMilestone('d',3)
    }
})

addLayer("gm", {
    name: "gm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Gm", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['g','pc','d'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "white",
    resource: "完成的游戏", // Name of prestige currency
     requires: new Decimal(6), // Can be a function that takes requirement increases into account
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.5, // Prestige currency exponent
    baseResource: "钥匙",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return new Decimal(hasUpgrade('p',41)+hasUpgrade('r',14)+hasUpgrade('c',14)
    +hasUpgrade('g',13)+hasUpgrade('pc',13)+hasUpgrade('d',13)) },  // A function to return the current amount of baseResource.
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "G", description: "Shift+G: 重置以获得完成的游戏", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a',35)}
})
addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("成就")
    },
    achievements: {
        11: {
            name: "故事开始了<br>The beginning",
            done() { return player.p.points.gte(1) },
            tooltip: "获得至少 1 完成的题目.",
        },
        12: {
            name: "没有+1了<br>No more Add 1",
            done() { return hasUpgrade('p',14) },
            tooltip: "购买前 4 个完成题目升级。",
        },
        13: {
            name: "指数级<br>Exponential",
            done() { return hasUpgrade('p',22) },
            tooltip: "购买第 6 个完成题目升级",
        },
        14: {
            name: "两两增益<br>Boost from all to all",
            done() { return hasUpgrade('p',31) },
            tooltip: "购买第 6,7,8,9 个完成题目升级。",
        },
        15: {
            name: "序章完<br>A completion",
            done() { return hasUpgrade('p',32) },
            tooltip: "购买前 10 个完成题目升级。",
        },
        21: {
            name: "回到开始<br>Back to the beginning",
            done() { return hasMilestone('r',0)||hasMilestone('c',0) },
            tooltip: "进行一次评分重置或者比赛重置。",
        },
        22: {
            name: "更深处的增益<br>Deep boost",
            done() { return hasUpgrade('r',11)||hasUpgrade('c',11) },
            tooltip: "购买评分或者比赛的第一个升级。",
        },
        23: {
            name: "第一章完<br>Another completion",
            done() { return hasMilestone('r',3)||hasMilestone('c',3) },
            tooltip: "达到评分或者比赛的所有里程碑。",
        },
        24: {
            name: "我都要！<br>I have both!",
            done() { return hasMilestone('r',0)&&hasMilestone('c',0) },
            tooltip: "解锁评分层级和比赛层级。<br>奖励：在所有重置中保留所有完成题目升级。",
        },
        25: {
            name: "计评分吗？<br>Is it RATED?",
            done() { return player.r.points.gte(9)&&player.c.points.gte(300) },
            tooltip: "拥有至少 9 评分和 300 完成的比赛.<br>奖励：解锁下一行的层级。",
        },
        31: {
            name: "回到开始，再一次<br>Back to the beginning AGAIN",
            done() { return player.g.points.gte(1)||player.pc.points.gte(1)||player.d.points.gte(1) },
            tooltip: "进行一次咕值，创造题目或者讨论重置。<br>奖励：评分和比赛永远被视为最先解锁。",
        },
        32: {
            name: "自动化<br>Automation",
            done() { return hasMilestone('g',2)||hasMilestone('pc',2)||hasMilestone('d',2)},
            tooltip: "达到咕值，创造题目或者讨论的第三个里程碑。",
        },
        33: {
            name: "多重增益<br>Multiple boost",
            done() { return (hasMilestone('g',0)+hasMilestone('pc',0)+hasMilestone('d',0))>=2},
            tooltip: "解锁咕值，创造题目和讨论中的至少两个。",
        },
        34: {
            name: "我全都要！<br>I have all!",
            done() { return player.g.points.gte(1)&&player.pc.points.gte(1)&&player.d.points.gte(1) },
            tooltip: "解锁咕值，创造题目和讨论。<br>奖励：它们都永远被视为最先解锁，并且解锁钥匙升级。",
        },
        35: {
            name: "芝麻开门<br>The key to the door",
            done() { return hasUpgrade('p',41)||hasUpgrade('r',14)||hasUpgrade('c',14)||hasUpgrade('g',13)||hasUpgrade('pc',13)||hasUpgrade('d',13) },
            tooltip: "获得至少一把钥匙。<br>奖励：解锁最终层级。",
        },
       41: {
            name: "全新的开始<br>Brand new beginning",
            done() { return player.gm.points.gte(1) },
            effect(){return (new Decimal(1.5)).pow(player.gm.points)},
            tooltip(){return "进行一次游戏重置。<br>奖励：根据完成的游戏，增强前面所有层级的资源获取。<br>目前:"
            +(hasAchievement('a',41)?format(achievementEffect('a',41))+'x':'1x')},
        },
       42: {
            name: "你又来了<br>You are here again",
            done() { return player.gm.points.gte(2) },
            tooltip: "拥有 2 完成的游戏.",
        },
       43: {
            name: "越来越快<br>Faster and Faster",
            done() { return player.gm.points.gte(4) },
            tooltip: "拥有 4 完成的游戏.",
        },
       44: {
            name: "买升级真无聊<br>Buying upgrades is boring",
            done() { return player.gm.points.gte(8) },
            tooltip: "拥有 8 完成的游戏.",
        },
       45: {
            name: "真正的结局<br>The true ENDgame",
            done() { return player.gm.points.gte(10) },
            tooltip(){return this.done()?'拥有 10 完成的游戏。<br>奖励：写下成就名称中的所有大写字母，按 A 到 Z 排序。这就是答案。'
            :"拥有 10 完成的游戏。<br>奖励：得到答案。";},
            onComplete(){str='写下成就名称中的所有大写字母，按 A 到 Z 排序。这就是答案。'
            alert(str);console.log(str);}
        },
    },
    tabFormat: [
        "blank",  
        ["display-text", function() { return "成就: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
        "blank", "blank",
        "achievements",
    ],
})

// addLayer("p", {
//     name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
//     symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
//     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
//     startData() { return {
//         unlocked: true,
//         points: new Decimal(0),
//     }},
//     color: "#4BDC13",
//     requires: new Decimal(10), // Can be a function that takes requirement increases into account
//     resource: "prestige points", // Name of prestige currency
//     baseResource: "points", // Name of resource prestige is based on
//     baseAmount() {return player.points}, // Get the current amount of baseResource
//     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
//     exponent: 0.5, // Prestige currency exponent
//     gainMult() { // Calculate the multiplier for main currency from bonuses
//         mult = new Decimal(1)
//         return mult
//     },
//     gainExp() { // Calculate the exponent on main currency from bonuses
//         return new Decimal(1)
//     },
//     row: 0, // Row the layer is in on the tree (0 is the first row)
//     hotkeys: [
//         {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
//     ],
//     layerShown(){return true}
// })
