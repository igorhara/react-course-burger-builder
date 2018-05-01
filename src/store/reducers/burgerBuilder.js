import * as actionTypes from '../actions/actionTypes';


const initialState = {
    ingredients:null,
    totalPrice:4,
    error:false,
    building:false
};

const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon: 0.7
};

const addIngredient = (newState,action)=>{
    newState.ingredients[action.ingredientName]++;
    const priceAddition = INGREDIENT_PRICES[action.ingredientName];
    const oldPriceAdd = newState.totalPrice;
    newState.building=true;
    newState.totalPrice=oldPriceAdd+priceAddition;
};

const removeIngredient = (newState,action)=>{
    newState.ingredients[action.ingredientName]--;
    const priceDeduction = INGREDIENT_PRICES[action.ingredientName];
    const oldPriceSub = newState.totalPrice;
    newState.building=true;
    newState.totalPrice=oldPriceSub-priceDeduction;
};

const reducer = (state = initialState,action)=>{
    //console.log('reducer',state,action);
    const newState = {
        ...state,
        ingredients: state.ingredients?{...state.ingredients}:null
    };
    switch(action.type){
        case(actionTypes.ADD_INGREDIENT):
            addIngredient(newState,action);
            break;
        case(actionTypes.REMOVE_INGREDIENT):
            removeIngredient(newState,action);
            break;
        case(actionTypes.SET_INGREDIENTS):
            newState.ingredients = action.ingredients;
            newState.error=false;
            newState.totalPrice=4;
            newState.building=false;
            break;
        case(actionTypes.FETCH_INGREDIENTS_FAILED):
            newState.error=true;
            break;
        default:
            break;
    }
    return newState;
};


export default reducer;