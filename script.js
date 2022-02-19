
const dogApp = {};

dogApp.factUrl = `https://dog-facts-api.herokuapp.com/api/v1/resources/dogs/all`

dogApp.junoProxy = `https://proxy.hackeryou.com`

dogApp.breedUrl = `https://api.thedogapi.com/v1/breeds/search`

dogApp.breedApiKey = `f1a55c4b-d54f-449e-8cc8-1efcc2cebede`

dogApp.imageUrl = `https://api.thedogapi.com/v1/images/`

dogApp.imageApiKey = `f1a55c4b-d54f-449e-8cc8-1efcc2cebede`


dogApp.breedAjaxRequest = function(query){

    const breedPromise = $.ajax({
        url: dogApp.breedUrl,
        method: "GET",
        dataType: "json",
        data:{
            api_key:dogApp.breedApiKey,
            q: query
        },
    })
    return breedPromise;
}

dogApp.factAjaxRequest = function(){

    const factPromise = $.ajax({
        url: dogApp.junoProxy,
        method: "GET",
        dataType: "json",
        data: {
            reqUrl: dogApp.factUrl,
            params: {
                method: 'GET',
                dataType: 'json'
            }
        }
    })
    return factPromise;
}


dogApp.imageAjaxRequest = function(imageId){

    const imagePromise = $.ajax({
        url: `${dogApp.imageUrl}${imageId}`,
        method: "GET",
        dataType: "json",
        data:{
            api_key:dogApp.imageApiKey
        },
    })
    return imagePromise;
}

dogApp.displayAll = function(){

    const searchTerm = $('#Breed').val()
    const breedInfo = dogApp.breedAjaxRequest(searchTerm)
    breedInfo.then(function(breed){
        breed.forEach(function(breedObject){

            console.log(breedObject)            
            const insertHtml = `
            <div class="dog-container">
                <div class="dog-data">
                    <h2>Name: ${breedObject.name}</h2>
                    <h3 class="breedGroup"> Breed Group: ${breedObject.breed_group}</h3>
                    <h3 class="breedGroup"> Breed for: ${breedObject.bred_for}</h3>
                    <h3 class="temperament">Temperament: ${breedObject.temperament}</h3>
                    <h3 class="lifeSpan">Life Span: ${breedObject.life_span}</h3>
                    <h3 class="weight">Weight: ${breedObject.weight.metric} Kg</h3>
                    <h3 class="height">Height: ${breedObject.height.metric} cm</h3>           
                </div>
            </div>
            `
            const selectedId = breedObject.reference_image_id;
            $('section.results').append(insertHtml);
            
            const imageInfo = dogApp.imageAjaxRequest(selectedId)
            
            imageInfo.then(function(image){
                const htmlPic = `
                <div class="image-container">
                    <img src="${image.url}" alt="${image.name}">
                </div>
                `
                $('section.image').append(htmlPic)
            })

        })
    })

}

dogApp.displayFact = function(){

    const factInfo = dogApp.factAjaxRequest()
    factInfo.then(function(info){
        
        let index = Math.floor(Math.random() * info.length);
        for(let i = index; i< index + 1; i++){
    
            const htmlInfo = `
            <div class="info">
                <h2>Fun Fact Of The Day </h2>
                ${info[i].fact}
                </div>    
            `
            $('section.facts').append(htmlInfo);
        }
    })
}


$('form').on('reset', function(){

    $('section').empty();
})

dogApp.init = function () {

    $('form').on('submit', function(event){
        event.preventDefault();
        const searchedTerm = $('#Breed').val()
        if(searchedTerm !== ""){
            $('section').empty();
            dogApp.displayAll();
            dogApp.displayFact();
        }else{
            alert("Please complete the form!")
        }
    })
}

$(function () {
    dogApp.init();
})