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
import * as actions from "../../store/actions/index";


class BurgerBuilder extends Component{
    state={
        purchasing:false
    };

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(key=>ingredients[key]).reduce((c,i)=>c+i,0);
        return sum>0;

    }


    componentDidMount() {
       this.props.onInitIngredients();
    }


    purchaseHandler=()=>{
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    };


    purchaseCancelHandler =()=>{
        this.setState({purchasing:false});
    };

    purchaseContinueHandler =()=>{
        this.props.onInitPurchase();
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

        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
        if(this.props.ings){
             burger =(
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls price={this.props.price}
                                   ingredientAdded={this.props.onIngredientAdded}
                                   ingredientRemoved={this.props.onIngredientRemoved}
                                   purchasable={this.updatePurchaseState(this.props.ings)}
                                   disabled={disabledInfo} ordered={this.purchaseHandler}
                                   isAuth={this.props.isAuthenticated}
                    />
                </Aux>);
            orderSummary=    <OrderSummary ingredients={this.props.ings}
                                           purchaseCancelled={this.purchaseCancelHandler}
                                           purchaseContinue={this.purchaseContinueHandler}
                                           price={this.props.price}/>;

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
      ings:state.burgerBuilder.ingredients,
      price:state.burgerBuilder.totalPrice,
      error:state.burgerBuilder.error,
      isAuthenticated:state.auth.token !==null
  };
};

const mapDispatchToProps = dispatch =>{
  return{
      onIngredientAdded: (ingName)=> dispatch(actions.addIngredient(ingName)),
      onIngredientRemoved: (ingName)=> dispatch(actions.removeIngredient(ingName)),
      onInitIngredients: ()=> dispatch(actions.initIngredients()),
      onInitPurchase:()=>dispatch(actions.purchaseInit()),
      onSetAuthRedirectPath:(path)=>dispatch(actions.setAuthRedirectPath(path))
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));