import Universe from "../schemes/universe";
import WorldDB from "../schemes/world";
import BuildingWhitelist from "../../mongoDB/schemes/buildingWhitelist";
import IslandWhitelist from "../../mongoDB/schemes/IslandWhitelist"
import tagTree from "../../player_menu/server/data/whitelist_building.json"
import avatar from "../../player_menu/server/data/png_names.json"

export async function universeInit() {
	//Check for universe
	if (!!await Universe.findOne()) {
		console.log('found existing universe');
		let universe = await Universe.findOne()
		return Universe.findOne();
	} else {
		// console.log('Did not find existing universe');
		const universe = new Universe({

			avatar: JSON.stringify(avatar),
		});
		await universe.worlds.push("Allgemein")//initialising the first island that always exists
		await new WorldDB({
			name:"Allgemein",
			activeMap:"Allgemein1",
			activeMapNumber:1,
			MapCap1:100,
			MapCap2:200,
			MapCap3:300,
			MapCapMax:400,
			parent: "",
			children:[],
			shop:"",
			games:"",
			maps:[],


		}).save()

		await new IslandWhitelist({island:"Mathe"}).save()
		await new IslandWhitelist({island:"Deutsch"}).save()
		await new IslandWhitelist({island:"Allgemein"}).save()
		await new BuildingWhitelist({
			building: "Algebra",
			text: "Mathe",
			parent: "Mathe",
			expertSymbol: "A",
			$isDisabled:false
		}).save()
		await new BuildingWhitelist({
			building: "Statistic",
			text: "Mathe",
			parent: "Mathe",
			expertSymbol: "S",
			$isDisabled:false
		}).save()
		await new BuildingWhitelist({
			building: "Gedichtsanalyse",
			text: "Deutsch",
			parent: "Deutsch",
			expertSymbol: "A",
			$isDisabled:false
		}).save()
		await new BuildingWhitelist({
			building: "Satzbau",
			text: "Deutsch",
			parent: "Deutsch",
			expertSymbol: "A",
			$isDisabled:false
		}).save()

		await universe.save();
		console.log('universe created');
		return universe

	}
}

export async function checkForWorlds(){

	//Check for World
	if(!! await WorldDB.findOne()){
		const  worldDB = await WorldDB.findOne()
		// console.log('found world');
	} else {
		// console.log('Did not find existing world');
		const worldDB = new WorldDB()
		await worldDB.save();
		// console.log('world created');
	}
}

