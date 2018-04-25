import React,{Component} from 'react';
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/ui/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/ui/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import {connect} from "react-redux";
import * as actionTypes from "../../store/actions";


class BurgerBuilder extends Component{
    state={
        purchasing:false,
        loading:false,
        error:false
    };

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(key=>ingredients[key]).reduce((c,i)=>c+i,0);
        return sum>0;

    }


    componentDidMount() {
       /* axios.get("/ingredients.json")
            .then(response=>{
               this.setState({ingredients:response.data});
            }).catch(error=>{
                console.log("error called");
                this.setState({error:true});
            });*/
    }


    purchaseHandler=()=>{
        this.setState({purchasing:true});
    };


    purchaseCancelHandler =()=>{
        this.setState({purchasing:false});
    };

    purchaseContinueHandler =()=>{
        this.props.history.push('/checkout');
    };



    render(){
        const disabledInfo={
            ...this.props.ings
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = null

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
        if(this.props.ings){
             burger =(
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls price={this.props.price}
                                   ingredientAdded={this.props.onIngredientAdded}
                                   ingredientRemoved={this.props.onIngredientRemoved}
                                   purchasable={this.updatePurchaseState(this.props.ings)}
                                   disabled={disabledInfo} ordered={this.purchaseHandler}
                    />
                </Aux>);
            orderSummary=    <OrderSummary ingredients={this.props.ings}
                                           purchaseCancelled={this.purchaseCancelHandler}
                                           purchaseContinue={this.purchaseContinueHandler}
                                           price={this.props.price}/>;
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

const mapStateToProps = state=>{
  return {
      ings:state.ingredients,
      price:state.totalPrice
  };
};

const mapDispatchToProps = dispatch =>{
  return{
      onIngredientAdded: (ingName)=> dispatch({type:actionTypes.ADD_INGREDIENT,ingredientName:ingName}),
      onIngredientRemoved: (ingName)=> dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredientName:ingName})
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));