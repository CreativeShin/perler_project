var shortDesc = document.querySelectorAll('.shortDesc');

for(var i =0; i < shortDesc.length; i++){
    if(shortDesc[i].textContent.length > 80){
        var text = shortDesc[i].textContent;
        shortDesc[i].textContent = text.slice(0,78) + "...";
    }
}




// console.log(shortDesc);