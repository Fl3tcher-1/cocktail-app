

function handleData(data){

    //for every element get the key:value pairs and only return pairs with no null values
data.drinks.forEach(element => {
    // console.log( Object.values(element).filter(value => value !=null))
    let entries = Object.entries(element)

    let nonNUll = entries.filter(item => item[1] != null)


    makeDivs(nonNUll)

});
}

function makeDivs(drink){

    let container = document.getElementById('grid')
    let img = document.getElementById('image')
    let name = document.getElementById('header')
    let list = document.getElementById('list')
    let cocktailName 
    
    //create a div for every drink property
    let div = document.createElement('div')
    
    drink.forEach(property =>{
        
        if(property[0]=="strDrink"){
            name.innerHTML = property[1]
        } 
        if(property[0] =="strDrinkThumb"){
            img.setAttribute("src", `${property[1]}`)
        } else{
            //checks for categories to ignore
            let listItem = document.createElement('li')
            if(property[0] !=="strInstructionsDE" && property[0] !== "strInstructionsIE" && property[0]!="strInstructionsIT" && property[0]!= "idDrink" && property[0]!= "strDrink"
             && property[0]!= "strImageSource" && property[0] != "strImageAttribution" && property[0] != "strCreativeCommonsConfirmed" && property[0]!= "dateModified" && property[0] != "strVideo"){
                // div.textContent = `${property[0]} :  ${property[1]}`
                listItem.textContent = `${property[0].replace("str", "")} :  ${property[1]}`
                // div.appendChild(ul)
                list.appendChild(listItem)
            }

        }
    })

    // drink.forEach(property => {
    //     div.className = 'cocktail'
    //     let img = document.createElement('img')
    //     let ul = document.createElement('ul')
    //     // console.log(img)

    //     if (property[0] == "strDrink" ){
    //         div.id = property[1]
    //         let h3 = document.createElement('h3')
    //         cocktailName = property[1]
    //         h3.textContent = property[1]
    //         div.appendChild(h3)

    //     } if(property[0] =="strDrinkThumb"){
    //         img.setAttribute("src", `${property[1]}` )
    //         img.setAttribute("alt", `${cocktailName}`)
    //         img.id = div.id
    //         div.appendChild(img)
            
    //     } else{

    //         //checks for categories to ignore
    //         if(property[0] !=="strInstructionsDE" && property[0] !== "strInstructionsIE" && property[0]!="strInstructionsIT" && property[0]!= "idDrink" && property[0]!= "strDrink"
    //          && property[0]!= "strImageSource" && property[0] != "strImageAttribution" && property[0] != "strCreativeCommonsConfirmed" && property[0]!= "dateModified" && property[0] != "strVideo"){
    //             // div.textContent = `${property[0]} :  ${property[1]}`
    //             ul.textContent = `${property[0].replace("str", "")} :  ${property[1]}`
    //             div.appendChild(ul)
    //         }
    //     }
        
    // })
    container.appendChild(div)
    // drink.forEach(property => console.log(property))
    
}

//fetches data from an api and sends to a function when all data is fetched
function getCockatils (cocktail){

    // if there are any existing cocktails-- remove them before sending a fetch request
    let cocktails = document.getElementsByClassName('cocktail')
    if( cocktails.length !==0){
        console.log(cocktails.item(0))
        for(let i =0; i <cocktails.length;){
            console.log(cocktails.length)
            cocktails.item(0).remove()
        }
   
    }

     cocktail = document.getElementById('cocktail').value

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
    .then(response => response.json())
    
    .then(data => handleData(data))
    
    .catch(error => console.error(error))

    


}

