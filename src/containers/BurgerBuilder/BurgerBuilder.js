import React,{Component} from 'react';
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/ui/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";


const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component{
    state={
       ingredients:{
           salad:0,
           bacon:0,
           cheese:0,
           meat:0
       },
        totalPrice:4,
        purchasable:false,
        purchasing:false
    };

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(key=>ingredients[key]).reduce((c,i)=>c+i,0);
        this.setState({purchasable:sum>0});

    }

    addIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedIngredients={
            ...this.state.ingredients
        }
        updatedIngredients[type] = oldCount+1;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        this.setState({totalPrice: oldPrice+priceAddition, ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedIngredients={
            ...this.state.ingredients
        }
        updatedIngredients[type] = oldCount-1;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        this.setState({totalPrice: oldPrice-priceDeduction, ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler=()=>{
        this.setState({purchasing:true});
    };

    render(){
        const disabledInfo={
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing}>
                    <OrderSummary ingredients={this.state.ingredients}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls price={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                               purchasable={this.state.purchasable}
                    disabled={disabledInfo} ordered={this.purchaseHandler}
                />
            </Aux>
        );
    }

}

export default BurgerBuilder;