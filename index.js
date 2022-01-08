'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "chibi recipes";
const STOP_MESSAGE = "See you next time.";
const CANCEL_MESSAGE = "Okay. See you next time.";

const HELP_START = "I can help you make a tasty meal in 5 minutes. Just tell me if you want breakfast, lunch, dinner or a snack.";
const HELP_START_REPROMPT = "Do want to make something for breakfast, lunch, dinner, or a snack?";
const HELP_RECIPE = "Say yes if you want to make this recipe, or no to hear other options. You can also say 'Ingredients' to hear the ingredients.";
const HELP_RECIPE_REPROMPT = "Say yes if you want to make this recipe, or no to hear other options. To exit, just say 'cancel'.";
const HELP_INSTRUCTIONS = "To hear an instruction again, say 'repeat'. When you're ready for the next step, just say 'next'.";
const HELP_INSTRUCTIONS_REPROMPT = "Say 'repeat' if you want me to repeat a step. Say 'next' if you're ready for the next step.";

const CHOOSE_TYPE_MESSAGE = `Welcome to ${SKILL_NAME}! I can help you make a tasty meal in 5 minutes. Do you want to make breakfast, lunch, dinner, or a snack?`;
const REPROMPT_TYPE = "I have recipes for breakfast, lunch, dinner or snacks. What are you having today?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I don't have any recipes for ${chosenType}. I have recipes for breakfast, lunch, dinner or snacks. Which one do you want?`;

const RECIPE_ADJECTIVES = [
  "tasty",
  "super simple",
  "delicious",
  "great"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} recipe! Want me to show you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Sorry, I didn't get that. Say 'yes' if you want to make this recipe, or 'no' to make something else. Say 'Cancel' to exit.";
const NO_REMAINING_RECIPE = "That's all the recipes I've got for now! Do you want to make something else instead?"
const INGREDIENTS_INTRO = "For this recipe, you will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "Say yes if this is what you want to make. Say no to hear the next recipe."; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' when you're ready for the next step. if you want me to repeat, just say 'repeat'.";
const REPROMPT_INSTRUCTIONS = "When you're ready for the next step, just say 'next'. If you want me to repeat, say 'repeat'.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't get that. You can say 'next' or 'repeat'. Or, say 'Cancel' to exit.";
const CLOSING_MESSAGE = `That's it! <phoneme alphabet="ipa" ph="oʊmɛʃiəgɑɹi">omeshiagari</phoneme> kudasai!`;

const recipes = {
  breakfast: [
    {
      name: "Natto breakfast bowl",
      instructions: [
        "Natto is a very popular japanese ingredient with a distinctive texture. To make your breakfast bowl, you'll need one pack of single serve natto, some pre cooked rice, soy sauce, sesame oil and spring onion.",
        "First, warm up the rice and place into a large bowl.",
        "Open the natto, stir in the included sauce/s and spoon over the top of the rice.",
        "Drizzle the soy sauce and sesame oil over the natto.",
        "Garnish with some spring onion or nori shreds."
      ],
      ingredients: [
        "1 pack single serve natto",
        "pre cooked white rice",
        "soy sauce and sesame oil to taste",
        "spring onion or nori shreds"
      ]
    },
    {
      name: "Japanese breakfast egg rollup",
      instructions: [
        "To make your egg rollup, you'll need two eggs, one green onion, half a teaspon of soy sauce and sugar, and some kewpie mayo.",
        "First, finely chop the green onion and set aside.",
        "Crack the eggs and whisk together with soy sauce and sugar.",
        "Now, Heat a pan on medium-low heat with some cooking oil. Slowly pour egg mix into the pan and sprinkle in chopped green onions.  Cook for 2-3 minutes until eggs are no longer runny.",
        "Lastly, add a squeeze of Kewpie Mayo to cover the eggs.  Fold over one side to a form a  roll and continue rolling up the egg.  Cut into 2 and transfer to serving plate."
      ],
      ingredients: [
        "2 eggs",
        "1 stalk green onion",
        "1/2 teaspoon soy sauce",
        "1/2 teaspoon sugar",
        "kewpie mayo"
      ]
    },
    {
      name: "Matcha granola",
      instructions: [
        "I don't know about you, but anything matcha flavoured always take me staight to Japan! For this recipe, you'll need a bowl of store-bought granola, two table spoons of matcha powder, three tablespoons of maple syrup, and milk.",
        "First, pour the granola into a bowl.",
        "Sprinkle the matcha powder in a mix well.",
        "Next, pour your milk in.",
        "Dizzle the maple syrup and give it a quick stir"
      ],
      ingredients: [
        "1 bowl granola",
        "2 tbsp matcha powder",
        "3 tbsp maple syrup",
        "Milk"
      ]
    }
  ],
  lunch: [
    {
      name: "Cold green tea soba",
      instructions: [
        "There's something soothing about eating a simple bowl of soba dipping noodles. For this recipe, You'll need one serve of green tea soba noodles, tsuyu dipping sauce, wasabi, green onion, and some shredded nori seaweed and tempura flakes for toppings.",
        "First, bring some water to the boil. Boil the soba noodles for about 4-5 minutes.",
        "Now, strain your noodles using a colander and run it under cold water. This will make sure your noodles don't go soggy. Put them aside to dry.",
        "Time for the dipping sauce. Put the tsuyu dipping sauce and wasabi into a small bowl.",
        "Time to serve! Put your noodles on a plate. Sprinkle the nori seaweed and tempura flakes on top. Eat your noodles by dipping the noodles in the sauce."

      ],
      ingredients: [
        "1 serve green tea soba noodles",
        "50 ml tsuyu dipping sauce",
        "green onion",
        "wasabi",
        "Shredded nori seaweed",
        "tempura flakes"
      ]
    },
    {
      name: "Crumbed fish and nori sando",
      instructions: [
        "To make your sando, you'll need some frozen crumbed fish, bread, lettuce, butter, a sheet of nori seaweed, and kewpie mayo.",
        "This recipe actually takes more than 5 minutes to make... but it'll only take 5 minutes to assemble if you don't count the waiting time! you'll see what I mean in a bit. Say next if you want to go continue.",
        "First, pre-heat the oven to 200 degrees celcius. Place the crumbed fish in the oven and cook for 25 minutes. Get on with whatever you are doing while you wait for it to cook. I'll see you in 25 minutes.",
        "The fish should be done now! Take it out of the oven. Butter the bread, get your lettuce, nori seaweed and mayo and assemble your sandwich in which ever order you like."
      ],
      ingredients: [
        "1 Frozen crumbed fish",
        "1 sheet of nori seaweed",
        "butter",
        "lettuce",
        "kewpie mayo",
        "bread"

      ]
    },
    {
      name: "Prawn and avocado salad with siracha mayo",
      instructions: [
        "This salad is healthy, simple and delicious. You'll need one avo, eight cooked prawns, salad leaves, kewpie mayo and a bit of siracha.",
        "Firstly, slice your avocado in half, scoop out the stone and remove the flesh from the skin. Slice the flesh into thin pieces.",
        "In a bowl, mix together 2 tablespoons of mayo and 1 teaspoon of siracha.",
        "Lastly, Put your salad greens on a plate or bowl. Top it with the avocado, then the prawns. Drizzle with the siracha mayo."
      ],
      ingredients: [
        "one avocado",
        "eight cooked prawns",
        "salad greens",
        "kewpie mayo",
        "siracha"
      ]
    }
  ],
  dinner: [
    {
      name: "Chicken and ponzu stir fry",
      instructions: [
        "Enjoy a tantalising combination of savoury umami and refreshing citrus flavours with this chicken ponzu stir fry. You'll need three hundred grams chicken breast or thigh, fifty grams leek, thirty grams ponzu sauce, and salt and pepper to taste, and perhaps some green onion for garnish.",
        "First, cut the chicken into bite-size pieces and season with salt and pepper. Slice the leek into diagonal strips.",
        "In a lightly oiled pan, stir fry the chicken and leek on a high heat. Once the chicken is cooked, add the ponzu sauce to coat the chicken.",
        "Once that's done, garnish with chopped green onion. You can also serve this with some rice if you prefer."

      ],
      ingredients: [
        "300g chicken breast or thigh",
        "50g leek",
        "30g ponzu yuzu soy sauce",
        "salt and pepper to taste",
        "green onion"
      ]
    },
    {
      name: "Miso Pork and Cabbage Stir Fry",
      instructions: [
        "This simple and delicious stir fry is pretty hard to beat. For this recipe, you'll need a few things.",
        "First, you'll need one hundred sixty grams of pork belly slices, two hundred grams of cabbage, half a clove of garlic.",
        "Got it? Now, you'll also need one teasoon of miso paste and half a tablespoon of broad bean chilli paste.",
        "Got all your ingredients? Great! First, Cut the pork belly slices in to 3 centremetre long strips. Chop the cabbage into bite-sized pieces. and mince the garlic clove.",
        "Heat a frying pan with some oil. Add the garlic and fry until brown.",
        "Add the pork and broad bean chilli paste. Stir and fry until browned.",
        "Finally, add in the miso paste with a little bit of water, and make sure the miso paste is properly dissolved. Fry for another 30 seconds."
      ],
      ingredients: [
        "160g pork belly slices",
        "200g cabbage",
        "1/2 clove garlic",
        "1 tsp miso paste",
        "1/2 tsp broad bean chilli paste"

      ]
    },
    {
      name: "Foil Wrapped salmon And Mushrooms",
      instructions: [
        "For this recipe, you'll need a few things.",
        "You'll need one salmon fillet, enoki mushrooms, butter, and some foil.",
        "Got the first few things? Cool! You'll also need some ponzu sauce, and salt and pepper to taste.",
        "First, wash and cut the root off the mushrooms. Make one or two scores on the top of your salmon fillets and sprinkle with a little salt.",
        "Place your salmon onto the foil. Arange a bit of mushroom on top and finish with a little pat of butter.",
        "Carefully wrap up, then place your salmon foil packet in a warmed frying pan. Cook for 4 minutes on a medium heat, then 4 minutes over a low heat. Yes, it takes more than 5 minutes, but it's worth it, trust me!",
        "When that's done, unwrap, serve and drizzle with some ponzu sauce.",
      ],
      ingredients: [
        "1 salmon fillet",
        "Mushrooms",
        "Butter",
        "Ponzu sauce",
        "foil",
        "Salt and pepper to taste"
      ]
    },
    {
      name: "Kitsune Udon",
      instructions: [
        "Well done on choosing Japan's favourite udon soup! Did you know that the name Kitsune means fox? Legend has it that the tofu pocket in this udon is spirit fox's favourite food, hence the name of this dish. ",
        `For this recipe, you'll need some pre-cooked udon noodles, tsuyu soup stock, <phoneme alphabet="ipa" ph="əbuɹɑgɛ">abura-age</phoneme> deep fried tofu, and some green onion.`,
        `First, pour some boiling water over the <phoneme alphabet="ipa" ph="əbuɹɑgɛ">abura-age</phoneme> to remove any excess oil. Set aside.`,
        "Pour the tsuyu stock into a saucepan with 500 millilitres of water. Heat up over a medium heat.",
        `Add the <phoneme alphabet="ipa" ph="əbuɹɑgɛ">abura-age</phoneme> tofu. Simmer for approximately 5 minutes before adding udon.`,
        `Once the udon have simmered for about 5 minutes, pour into a bowl with a little of the soup and the the <phoneme alphabet="ipa" ph="əbuɹɑgɛ">abura-age</phoneme>. Garnish with sliced green onions.`

      ],
      ingredients: [
        "pre-cooked udon noodles",
        "tsuyu soup stock",
        `<phoneme alphabet="ipa" ph="əbuɹɑgɛ">abura-age</phoneme> deep fried tofu`,
        "green onion"

      ]
    }

  ],
  snack: [

    {
      name: "Sweet And Salty Nori Seaweed Popcorn",
      instructions: [
        "Enjoy a different take on sweet and salty popcorn with this recipe! You'l need a few things for this recipe.",
        "First, prepare one tablespoon of nori seaweed flakes, one tablespoon of light brown sugar, and half a teaspoon of salt.",
        "You'll also need one tablespoon of oil, and seventy five grams of popcorn kernel.",
        "Ready to start? Great! Firstly, combine the nori seaweed flakes, sugar and salt in a small bowl. If you have a pestle and mortar, feel free to grind it into a fine powder.",
        "Heat some oil in a deep pan or a pot. Add the corn kernels and put the lid and cook, shaking the pan occasionally until all the kernels have popped.",
        "Transfer the popped corn to a large bowl. Sprinkle over your sweet and salty nori mixture and use your hands to mix well until every piece is coated."
      ],
      ingredients: [
        "1 tbsp nori seaweed flakes",
        "1 tbsp light brown sugar",
        "1/2 tsp salt",
        "1 tbsp oil",
        "75g popcorn kernels",
      ]
    },
    {
      name: "Miso soup with tofu",
      instructions: [
        "The classic of the classics. To make miso soup, you'll need 1 tablespoon of miso paste, a few cubes of soft tofu, and spring onion to garnish.",
        "Prepare some boiling water.",
        "Pour the boiled water into a small bowl. Slowly dissolve the miso paste.",
        "Pop in the tofu cubes",
        "Finally, garnish with some chopped spring onion.",
      ],
      ingredients: [
        "1 tbsp miso paste",
        "few cubes of soft tofu",
        "Green onion"
      ]
    },
    {
      name: "Spicy edamame",
      instructions: [
        "In the world of Japanese snacks, there is nothing as simple and delightful as edamame. For this recipe you'll only need two things - Frozen or fresh edamame, and japanese seven spice.",
        "To cook frozen pre-cooked edamame, place them in a large bowl and completely cover with boiling water. Leave for a few minutes, then drain. If you're using fresh, cook for less time.",
        "To season, sprinkle with Japanese seven spice before serving.",
        "Serve in a bowl along with another empty bowl to dispose of the pods. Remember, you can’t eat the pods!",
        "To eat, simply pop the beans out of the pod using either your hands or your mouth."
      ],
      ingredients: [
        "Frozen or fresh edamame",
        "Japanese seven spice, to season"
      ]
    }
  ]
};







/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      //this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
  },

  'NoRecipeLeftHandler': function(){
    this.emit(':tell', NO_REMAINING_RECIPE);
  },

  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },

  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
      this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});



exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers);
  alexa.execute();
};
