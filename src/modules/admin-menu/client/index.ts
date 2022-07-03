import axios from "axios";

export async function addNewIslandToTagTree(newIslandData, tagTree){


    const data = await checkNewIslandData(newIslandData, tagTree)
    if(!data){
        console.log("wrong data")
        return false
    }
    //muss so sein nicht löschen
    let island = {island: data.island}

    let newTag = {
        island: island.island,
        children: []
    }

    await axios.put('/admin/newIslandWhitelist', {
        island: island
    })

    for (let i in data.building)    {

        let building = {
            building: data.building[i],
            text: data.island,
            parent: data.island,
            expertSymbol: data.expertSymbol[i],
            $isDisabled:false
        }

        await axios.put('/admin/newBuildingWhitelist', {
            building: building
        })
        //@ts-ignore
        newTag.children.push(building)
    }
    return newTag
}

export async function addBuildingToWhitelist(buildingData, tagTree){

    if(!await checkBuildingCreationData(buildingData, tagTree)){
        return false
    }
    await axios.put('/admin/newBuildingWhitelist', {
        building: {
            building: buildingData.building,
            text: buildingData.island,
            parent: buildingData.island,
            expertSymbol: buildingData.expertSymbol,
            isDisabled: false
        }
    })
}

async function checkBuildingCreationData(buildingData, tagTree){

    if(!await checkForEmptyString(buildingData)){
        console.log("empty string")
        return false
    }
    if(!checkOnlyLetters(buildingData.building)){
        console.log("not only letters in building input field")
        return false
    }
    if(!checkOnlyLetters(buildingData.expertSymbol)){
        console.log("not only letters in symbols input field")
        return false
    }
    if(!await checkForExistingNameInTagTree(tagTree, buildingData.building)){
        console.log("already in tag tree")
        return false
    }
    return true
}

export async function checkNewIslandData(newIslandData, tagTree){
    if(!await checkCharsOfIslandData(newIslandData)){
        console.log("illegal character in inputfield")
        return false
    }
    const island = newIslandData.island
    const buildings = await strToArray(newIslandData.building)
    const expertSymbols = await strToArray(newIslandData.expertSymbol)

    if(!await runChecksForIslandCreation(tagTree, island, buildings, expertSymbols)){
        console.log("already exists")
        return false
    }
    return {
        island: island,
        building: buildings,
        expertSymbol: expertSymbols
    }
}

function checkForEmptyString(newIslandData){
    for(let element in newIslandData){
        if(newIslandData[element] === ""){
            return false
        }
    }
    return true
}

function checkCharsOfIslandData(newIslandData){

    if(!checkForEmptyString(newIslandData)){
        return false
    }
    if(!checkOnlyLetters(newIslandData.island)){
        return false
    }
    if(!checkOnlyLetterWhitespaceComma(newIslandData.buildings)){
        return false
    }
    if(!checkOnlyLetterWhitespaceComma(newIslandData.expertSymbol)){
        return false
    }
    return true
}

async function runChecksForIslandCreation(tagTree, island, buildings, expertSymbols){

    if(!checkDuplicateInBuildingInput(buildings)){
        console.log("duplicate building")
        return false
    }

    if(buildings.length !== expertSymbols.length){
        console.log("symbols and buildings are not the same numbers")
        return false
    }
    if(!await checkForExistingNameInTagTree(tagTree, island)){
        console.log("island already exist")
        return false
    }

    for(let index in buildings){
        let check = await checkForExistingNameInTagTree(tagTree, buildings[index])
        if(!check){
            return false
        }
    }
    return true
}

async function checkForExistingNameInTagTree(tagTree, name){
    console.log(name)
    for(let index in tagTree){
        if(tagTree[index].island.toLowerCase() === name.toLowerCase()){
            //mit Inselname vergleichen
            return false
        }
        let child = tagTree[index].children
        for(let index2 in child){
            // mit gebäude namen vergleichen
            if(child[index2].building.toLowerCase() === name.toLowerCase()){
                return false
            }
        }
    }
    return true
}
function checkDuplicateInBuildingInput(data){
    let arrLowerCase = data.map(element =>{
        return element.toLowerCase()
    })
    let set = new Set(arrLowerCase)
    if(set.size !== arrLowerCase.length){
        return false
    }
    return true
}

function checkOnlyLetterWhitespaceComma(str){
    return /^[a-zA-ZäöüÄÜÖ\s,-]+$/.test(str)
}

function checkOnlyLetters(str){
    return/^[a-zA-ZäöüÄÜÖ-]+$/.test(str)
}

function strToArray(str){
    return str.replace(/\s/g, "").split(",")
}

export default class RpgClientEngine {}
