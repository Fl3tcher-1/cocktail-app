
let paginationDivs =[]
let measure

if ( document.URL.includes("index.html")){
    init()
}

// inits the webpage when user changes measure
let select = document.getElementById("measurements")
select.addEventListener("change", ()=>{
    removeCocktails()
    init()
})
// pagination init
let totalDrinkNumber
let itemsPerPage = 5
let currentPage =1

// drink init

// ******************************************************INIT*******************************************************************8
function init() {

    removeCocktails()
    measure = measureType()
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
}

// ******************************************************REMOVE DRINKS*******************************************************************8
//remove existing cocktails
function removeCocktails() {
    paginationDivs =[]
    document.querySelector('.pagination').innerHTML =""

    console.log("removing")

    let cocktails = document.getElementsByClassName('gridCocktails')
    // console.log(cocktails)
    if (cocktails.length !== 0) {
        // console.log(cocktails.item(0))
        for (let i = 0; i < cocktails.length;) {
            // console.log(cocktails.length)
            cocktails.item(0).remove()
        }

    }
}
// ******************************************************FETCH DATA*******************************************************************8
//fetches data from an api and sends to a function when all data is fetched
function getCocktails(cocktail) {

removeCocktails()
let search = searchType()
measure = measureType()
cocktail = document.getElementById('cocktail').value
console.log(search == "non-alcoholic")

if ( cocktail === "" && (search !="alcoholic" && search!= "non-alcoholic")){
    alert("please enter a valid search value")
    init() 
}

// if a search value provided, use corresponsing api call to get desired data
if (cocktail != ""){
    if (search === 'name') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
    }
    if (search === 'ingredient') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${cocktail}`)
        .then(response => response.json())
        .then(data =>handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search === 'category') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${cocktail}`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search === 'glass') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${cocktail}`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
    }
    document.getElementById('cocktail').value = ""
    
} else{
    if (search === 'alcoholic') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search == "non-alcoholic") {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }   

    document.getElementById('cocktail').value = ""
}
}

// ******************************************************GET SEARCH TYPE*******************************************************************8
function searchType() {
    return document.getElementById("select").value
}
function measureType(){
    return document.getElementById('measurements').value
}

// ******************************************************HANDLE DATA*******************************************************************
function handleData(data) {
    //if data has no null values, create divs on page, else repopulate homepage
    if ( !checkNUll(data)){
        totalDrinkNumber = data.drinks.length
        //for every element get the key:value pairs and only return pairs with no null values
        data.drinks.forEach(element => {
            // console.log( Object.values(element).filter(value => value !=null))
            let entries = Object.entries(element)
            let nonNUll = entries.filter(item => item[1] != null)
            makeDivs(nonNUll)
           
        });
    } else{
        alert('no results found')
        init()
    }
}

// used when fetch request only returns a cocktail name and an image, then it makes another fetch request to get full details
function handleSmallData(data){
    paginationDivs =[]

// goes through data and fetches full data for every cocktail
data.drinks.forEach(drink =>{
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink.strDrink}`)
    .then(response => response.json())
    .then(data => handleData(data))
    .catch(error => console.error(error))
    // console.log(drink.strDrink)
})
}

// ******************************************************MAKE COCKTAIL DIVS*******************************************************************8

function makeDivs(drink) {
    let listItems = []
    // let measures =[]
    // let container = document.getElementById('grid')
    let div = document.createElement('div')
    div.className = "gridCocktails"

    let list = document.createElement('ul')

    drink.forEach(property => {
        let h = document.createElement('h2')
        let img = document.createElement('img')
        list.className = "list"
        // console.log(property)

        // checks property values and creates appropriate tags
        if (property[0] == "strDrink") {
            h.className = "header"
            h.innerHTML = property[1]
            name.innerHTML = property[1]
            div.appendChild(h)
        }
        if (property[0] == "strDrinkThumb") {
            img.className = "image"
            img.setAttribute("src", `${property[1]}`)
            div.appendChild(img)
        } else {
            //checks for categories to ignore
            if (property[0] !== "strInstructionsDE" && property[0] !== "strInstructionsIE" && property[0] != "strInstructionsIT" && property[0] != "idDrink" && property[0] != "strDrink"
                && property[0] != "strImageSource" && property[0] != "strImageAttribution" && property[0] != "strCreativeCommonsConfirmed" && property[0] != "dateModified" && property[0] != "strVideo"
                && !property[0].includes("InstructionsES") && property) {

                    // console.log(`${property[0].replace("str", "")} :<br> ${property[1]}`)
                listItems.push(`${property[0].replace("str", "")} :<br> ${property[1]}`)
            }
        }
    })
    // console.log(listItems)
    if(measure =="metric"){
        metricConversion(listItems)
    }
    joinIngredientMeasures(listItems)
    // console.log(listItems)
    // joins array items into list elements
    var htmlList = listItems.map(item => {
        
        // console.log(item)
        // console.log(item, item.length)
        // checks for empty list header
        if(item.length >16){
            // console.log(item.split("<br>")[0])
            return '<li class="listItems1">' + item.split("<br>")[0] + '</li> <li class="listItems2">' + item.split("<br>")[1] + '</li>'
        }
        //returns items after splitting into seperate lists in order to use multiple colours
    }).join('')

    list.innerHTML = htmlList

        div.appendChild(list)
        // container.appendChild(div)
        paginationDivs.push(div)
        // console.log(div)

        // once all drink divs have been added to array
        // console.log(totalDrinkNumber, paginationDivs.length)
        if(paginationDivs.length == totalDrinkNumber || totalDrinkNumber ==1){
            displayItems(paginationDivs)
        }
        // send created populated grids into pagination

}

// convert imperial measures to metric
function metricConversion(data){
    for (let i =0; i <data.length; i ++){
        let measures =[]
        let measureVal 
            // only runs if data contains imperial measures
            if(data[i].includes("oz") && !data[i].includes("ml")){
                let splitIndex = data[i].indexOf("<br>")
                // goes through the string and selects the part containing the measurement
                let measure = data[i].substring(splitIndex).replaceAll("oz"," ").replace("<br>", " ").trim().split(" ")
                // console.log(data[i], splitIndex, measure)

                // measure can contain multiple values as it matches all digits, so a for each is used
                measure.forEach(measure=>{
                    // deal with fractions
                if(measure.includes("/")){
                    let splitMeasure = measure.match(/\d+/g)
                    let fraction = splitMeasure[0]/splitMeasure[1]
                    measures.push( Number(fraction *29.57353193) +" ml")
                } else{
                    measures.push( Number(measure *29.57353193) +" ml")
                }
            })

            // used to get the param name of current measure
            if(data[i].includes("Measure")){
                let split = data[i].split(/\s+/g)
                measureVal = split[0]
            }
            // measures.length >1 means fractions that must be added to a whole number
            if(measures.length >1){
                // console.log(measures[0])
                measures[0] = Number(measures[0].replace(" ml", ""))
                measures[1] = Number(measures[1].replace(" ml", ""))
                let combine = measures[0] + measures[1]
                measures= Math.ceil(combine) +" ml"
                // console.log(measures)
            } else{
                 measures = Number(Math.ceil(measures[0].replace(" ml", ""))) +" ml"
            }
            // edits data values
            data[i] = `${measureVal} :<br>  ${measures}`
        }
    }
 
}

// joins ingredients with measures into string arrays
function joinIngredientMeasures(data){
    let ingredients =[]
    let measures = []
    let combined = []
    for(let i=0; i <data.length; i++){
        // console.log(i, data[i],)
        // console.log(data[i], i)
        if(data[i].includes("Ingredient")){
            ingredients.push(data[i])
        }
        if( data[i].includes("Measure")){
            measures.push(data[i])
        }
    }
    
    for(let i=0; i<ingredients.length;i++){
        // console.log("ingredient",i, "measures", measures.length, measures)
         if(i > measures.length ){ // when there are more ingredients than measures

            let ingredientSubstr = ingredients[i].split(" ")
            combined.push(ingredientSubstr[0] + ingredientSubstr[1] + ingredientSubstr.slice(2).join(" ") )

         }else if(i== measures.length){ // when same amount of ingredients and measures
            // console.log(measures[index], measures[i], measures[i-1])
            let ingredientSubstr = ingredients[i].split(" ")
            // console.log(ingredientSubstr,measuresSubstr, "slice", measuresSubstr.slice(2))
            combined.push(ingredientSubstr[0] + ingredientSubstr[1] + ingredientSubstr.slice(2).join(" ") )
        
        } else{
            let ingredientSubstr = ingredients[i].split(" ")
            let measuresSubstr = measures[i].trim().split(" ")
            // console.log(ingredientSubstr,measuresSubstr, "slice", measuresSubstr.slice(2))
            combined.push(ingredientSubstr[0] + ingredientSubstr[1] + measuresSubstr.slice(2).join(" ") + " " + ingredientSubstr.slice(2).join(" ") )

        }
    }

    join(data, combined)
}
// replaces main array with joined values
function join(data, joinedData){

    // loops through data and joins ingredients with measures
    for(let i=0; i <data.length; i ++){
        // console.log(data[i],i, data.length)
        if(data[i].includes("Ingredient")){
            // finds ingredient number and uses corresponding index from joined arr
            let number = data[i].match(/\d/)
            data[i] = joinedData[number -1]
            
        } 
        if(data[i].includes("Measure")){ //clears measures since no longer needed
            data[i] =" "
        }

    }
}

// ******************************************************PAGINATION*******************************************************************8

// add elements to dom
function displayItems(data ){
    // console.log(data)
    // container to store cocktails
    let container = document.getElementById('grid')
    // page counts and data
    let totalPages = Math.ceil(data.length/ itemsPerPage)
    
    let items =[]
    
    // 1st item to be displayed
    let startIndex = (currentPage-1) *itemsPerPage
    // last item to be displayed on page
    let lastIndex = startIndex +itemsPerPage
    // slice data to only show selected indexes
    items = data.slice(startIndex, lastIndex)
    // console.log({startIndex}, {lastIndex}, items)

    // removes existing cocktails otherwise it will add on top of the dom without removing all items from array
    let existingCocktails =document.querySelectorAll('.gridCocktails')
    existingCocktails.forEach(cocktail=>{
        cocktail.remove()
    })
    
    items.forEach(cocktail =>{
        // console.log(cocktail.children[0])
        container.appendChild(cocktail)
    })
    populatePageNumbers(totalPages)
    items = []
    
}

// create page numbers
function populatePageNumbers(totalPages){
    document.querySelector('.pagination').innerHTML = ""
    
    for (let i=1; i <=totalPages; i ++){
        document.querySelector('.pagination').innerHTML += `<button class ="page-button">${i}</button>`
    }
    currentPageBtn()
}

// change style for current page button
function currentPageBtn(){
    let pageNums = document.getElementsByClassName('pagination')[0].childNodes

    pageNums.forEach(btn =>{
        if(btn.innerHTML == currentPage){
            btn.style.opacity =1
        } else{
            btn.style.opacity = 0.6
        }
    })
   
}
// ads a continuos listener for clicking page numbers
document.querySelector('.pagination').addEventListener("click", e=>{
    window.scrollTo(0,0)
    if(e.target.classList.contains("page-button")){
        currentPage = Number(e.target.textContent)
        displayItems(paginationDivs,itemsPerPage, currentPage)
    }
})



// ******************************************************SCROLL BLUR*******************************************************************8
var timer
var elements = document.getElementById('gridContainer')

if (elements !== null){
// when the user scrolls it blurs the screen, on 100ms of scroll release it unblurs
    window.addEventListener("scroll", (e) => {
    clearTimeout(timer)

    // console.log(elements.children['grid'].children)
    for (let i = 0; i < elements.children['grid'].children.length; i++) {
        elements.children['grid'].children[i].children[2].style.filter = 'blur(2px)'
    }

    timer = setTimeout(function () {
        for (let i = 0; i < elements.children['grid'].children.length; i++) {
            elements.children['grid'].children[i].children[2].style.filter = 'blur(0px)'
        }
        // elements.style.filter = 'blur(0px)'
    }, 100)

    })
}

//  checks obj values and returns true if a null is found
function checkNUll(obj){
return Object.values(obj).includes(null)
}







