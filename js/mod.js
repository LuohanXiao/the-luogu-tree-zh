let modInfo = {
	name: "洛谷树",
	id: "luogutree",
	author: "WYXkk",
	pointsName: "思路",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1000,  // In hours
}



// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "发布",
}

let changelog = `<h1>更新列表:</h1><br>
	<h3>v1.0</h3><br>
		- 发布。<br>`

let winText = `恭喜！你已经通关了这个游戏。<br>点击“继续”然后查看最终成就来得到答案。`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade('p', 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('p',12)) gain=gain.add(1)
	if(hasUpgrade('p',13)) gain=gain.add(1)
	if(hasUpgrade('p',14)) gain=gain.add(1)
	if(hasUpgrade('p',21)) gain=gain.mul(2)
	if(hasUpgrade('p',22)) gain=gain.mul(upgradeEffect('p',22))
	if(hasUpgrade('p',23)) gain=gain.mul(upgradeEffect('p',23))
    if(hasUpgrade('r', 11)) gain=gain.mul(upgradeEffect('r',11))
    if(hasUpgrade('c', 11)) gain=gain.mul(upgradeEffect('c',11))
    if(hasUpgrade('g', 11)) gain=gain.mul(upgradeEffect('g',11))
    if(hasUpgrade('d', 11)) gain=gain.mul(upgradeEffect('d',11))
    if(hasUpgrade('pc', 11)) gain=gain.mul(upgradeEffect('pc',11))
    if(hasAchievement('a',41)) gain=gain.mul(achievementEffect('a',41))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.gm.points.gte(new Decimal(10))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}