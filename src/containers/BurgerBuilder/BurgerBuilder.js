import React,{Component} from 'react';
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/ui/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/ui/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";


const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon: 0.7
};
class BurgerBuilder extends Component{
    state={
       ingredients:null,
        totalPrice:4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    };

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(key=>ingredients[key]).reduce((c,i)=>c+i,0);
        this.setState({purchasable:sum>0});

    }


    componentDidMount() {
        axios.get("/ingredients.json")
            .then(response=>{
               this.setState({ingredients:response.data});
            }).catch(error=>{
                console.log("error called");
                this.setState({error:true});
            });
    }


    addIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldCount+1;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        this.setState({totalPrice: oldPrice+priceAddition, ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    };

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


    purchaseCancelHandler =()=>{
        this.setState({purchasing:false});
    };

    purchaseContinueHandler =()=>{
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search: '?'+queryString
        });
    };



    render(){
        const disabledInfo={
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = null

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
        if(this.state.ingredients){
             burger =(
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls price={this.state.totalPrice}
                                   ingredientAdded={this.addIngredientHandler}
                                   ingredientRemoved={this.removeIngredientHandler}
                                   purchasable={this.state.purchasable}
                                   disabled={disabledInfo} ordered={this.purchaseHandler}
                    />
                </Aux>);
            orderSummary=    <OrderSummary ingredients={this.state.ingredients}
                                           purchaseCancelled={this.purchaseCancelHandler}
                                           purchaseContinue={this.purchaseContinueHandler}
                                           price={this.state.totalPrice}/>;
            if(this.state.loading){
                orderSummary = <Spinner/>;
            }

        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder,axios);