const ts = "touchstart";
const tm = "touchmove";
const te = "touchend";
let isResizing = false;
const NUM_OF_COOKBOOKS = 7;
let testData;
let recipeDatabase = {
    cookbooks:{
        
    },
    categories: {
        Entrees: [

        ],
        Desserts: [

        ],
    }
}

function main(){
    
    addEventListener("resize", onWindowResize)

    fetchAllCookbooks();
    onWindowResize();

    $('[data-js-randomize-type]').on(te, function(){
        let category = $(this).data("js-randomize-type");
        $(".recipe_row").not(".header").remove()
        Object.keys(recipeDatabase[category]).forEach((el)=>{
            let recipeSet = recipeDatabase[category][el];
            let selector = getRandomInt(0, recipeSet.length);

            console.log(recipeSet[selector]);
            let cookbook = Object.keys(recipeSet[selector])[0];
            let page = recipeSet[selector]["Page"];
            if (page.includes("https")){
                page = `<a target="_blank" href="${page}">Link</>`;
            }
            $(".output_ctr").append(`
            <div class="recipe_row">
                <div class="cookbook_title">${el}</div>
                <div class="recipe_title">${recipeSet[selector][cookbook]}</div>
                <div class="page">${page}</div>
            </div>`)

        });
    });
    
}

function onWindowResize(){
    var ws = window.innerWidth / 1920;
	var hs = window.innerHeight / 1080;
	var ss = ws < hs ? ws : hs;
	var fs = 100 * ss;
    let phoneMod = (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("Android")) ? 3 : 1;
	$("body").css("font-size", (fs*phoneMod) + "px");
}


function fetchAllCookbooks(){
    for (i=0;i<NUM_OF_COOKBOOKS;i++){
        $.ajax({
            type: "GET",
            url: "https://opensheet.elk.sh/1j4r-0hz_XLAR368X4FvFB2vXHXjEx4FziZQZtCa229U/"+(i+1),
            timeout: 10000,
            success: function(data){
                testData = data
                pushToDatabase(data);
            },
            error: function(xhr, type){
                console.log(xhr)
                console.log(type)
            }
        });
    }
    // https://docs.google.com/spreadsheets/d/1-u37LxRZv695y-V2i6l5opujV1AUmIf4X6HDBk_gkfg/edit?usp=sharing

    $.ajax({
        type: "GET",
        url: "https://opensheet.elk.sh/1-u37LxRZv695y-V2i6l5opujV1AUmIf4X6HDBk_gkfg/1",
        timeout: 10000,
        success: function(data){
            testData = data
            pushToDatabase(data);
        },
        error: function(xhr, type){
            console.log(xhr)
            console.log(type)
        }
    });
}

function pushToDatabase(data){
    let activeCategory
    data.forEach((el)=>{
        let keys = Object.keys(el)
        let cookbook = keys[0]
        if (cookbook){
            if (el["Page"]){
                console.log(activeCategory)
                console.log(el)
                
                if (!recipeDatabase.cookbooks[cookbook]){
                    recipeDatabase.cookbooks[cookbook] = []
                }
                recipeDatabase.cookbooks[cookbook].push(el);
                recipeDatabase.categories[activeCategory].push(el);
            } else if (el[cookbook]){
                console.log("this is a category")
                activeCategory = el[cookbook];
                if (!recipeDatabase.categories[activeCategory]){
                    recipeDatabase.categories[activeCategory] = [];
                }
            }
        }
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
