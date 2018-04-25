import * as actionTypes from './actions';

const initialState = {
    ingredients:{
        salad:0,
        bacon:0,
        cheese:0,
        meat:0
    },
    totalPrice:4
};

const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon: 0.7
};


const reducer = (state = initialState,action)=>{
    //console.log('reducer',state,action);
    const newState = {
        ...state,
        ingredients:{...state.ingredients}
    };
    switch(action.type){
        case(actionTypes.ADD_INGREDIENT):
            newState.ingredients[action.ingredientName]++;
            const priceAddition = INGREDIENT_PRICES[action.ingredientName];
            const oldPriceAdd = state.totalPrice;
            newState.totalPrice=oldPriceAdd+priceAddition;
            break;
        case(actionTypes.REMOVE_INGREDIENT):
            newState.ingredients[action.ingredientName]--;
            const priceDeduction = INGREDIENT_PRICES[action.ingredientName];
            const oldPriceSub = state.totalPrice;
            newState.totalPrice=oldPriceSub-priceDeduction;
            break;
        default:
            break;
    }
    return newState;
};


export default reducer;