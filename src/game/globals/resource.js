var img_Tileset = "tileds.png";
var img_Stage1Bg = "castle.png";
var img_Stage2Bg = "city.png";
var img_Stage3Bg = "park.png";
var img_Stage4Bg = "meadow.png";
var img_Dialogue1Bg = "bedroom.png";
var img_Dialogue2Bg = "office.png";
var img_TitleBg = "title.png";
var plist_Chars = "characters.plist";
var img_Chars = "characters.png";
var plist_Hud = "hud.plist";
var img_Hud = "hud.png";
var fnt_Dialogue = "dialogue.fnt";
var fnt_DialogueImg = "dialogue.png";
var plist_DeathSmoke = "death_smoke.plist";
var img_DeathSmoke = "death_smoke.png";

var g_resources = [
    //image
    {src:img_Stage1Bg},
    {src:img_Stage2Bg},
    {src:img_Stage3Bg},
    {src:img_Stage4Bg},
    {src:img_Tileset},
    {src:img_Chars},
    {src:img_Hud},
    {src:img_DeathSmoke},
    {src:img_Dialogue1Bg},
    {src:img_Dialogue2Bg},
    {src:img_TitleBg},

    //plist
    {src:plist_Chars},
    {src:plist_Hud},
    {src:plist_DeathSmoke},

    //fnt
    {src:fnt_Dialogue},
    {src:fnt_DialogueImg}

    //tmx

    //bgm

    //effect
];

// Adding all the tmx for the stages
for (var st = 1; st <= kMaxLevel; st++) {
    g_resources.push({src:kTmxPrefix + st + ".tmx"});
}