def generateMarkup(arr):
    for item in arr:
        print("""    f1_""" + item + """_on_floor: {
        interesting_item: ["f1_picked_up_""" + item +"""", ['""" + item + """' , 1]],
        end: [["", 0]]
    },""")
        print("")

def generateFlags(arr):
    for item in arr:
        print("""    f1_picked_up_""" + item + """: {
        desc: "Pick up a """ + item.replace("_", " ") + """ on floor one.",
        complete: false
    },""")
        print("")
       
def generateRoomDetails(arr, start):
    i = start
    for item in arr:
        print('''            ''' + str(i) + ''': {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_''' + item + '''"]]],
                interacts: [["f1_''' + item + '''_on_floor", ["flag: -f1_picked_up_''' + item + '''"]]],
            },''')
        i += 1

commonArr = ["crafted_mana_potion", "greater_health_potion", "greater_mana_potion", "hempweed_ligament", "makeshift_steel_legwear", "runic_dagger", "deep_forest_explorer_scythe",
             "deep_forest_explorer_cap", "deep_forest_explorer_armour", "deep_forest_explorer_pants", "deep_forest_explorer_necklace", "deep_forest_explorer_bracelet",
             "forest_scourge_scale", "venomous_claw", "magic_bark", "sharp_claw"]
        
