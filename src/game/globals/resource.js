var img_Tileset = "tileds.png";
var img_Bg = "castle.png";
var img_Chars = "characters.png";
var plist_Chars = "characters.plist";
var fnt_Main = "main.fnt";
var fnt_MainImg = "main.png";
var fnt_Dialogue = "dialogue.fnt";
var fnt_DialogueImg = "dialogue.png";

var g_resources = [
    //image
    {src:img_Bg},
    {src:img_Tileset},
    {src:img_Chars},

    //plist
    {src:plist_Chars},

    //fnt
    {src:fnt_Main},
    {src:fnt_MainImg},
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