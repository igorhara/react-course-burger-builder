import React,{ Component } from 'react';
import Order from "../../components/Order/Order";
import axios from '../../axios-orders';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/order";
import {connect} from "react-redux";
import Spinner from "../../components/ui/Spinner/Spinner";
class Orders extends Component{

    componentDidMount() {
        this.props.onFetchOrders();
    }

    render(){
        let content = <Spinner/>;
        if(!this.props.loading){
            content = (
                <div>
                    {this.props.orders.map(order=>(
                        <Order key={order.id} ingredients={order.ingredients} price={order.price}/>
                    ))}
                </div>
            );
        }
        return content;
    }
}

const mapStateToProps = state=>{
    return {
        orders:state.order.orders,
        loading:state.order.loading
    };
};


const mapDispatchToProps = dispatch=>{
    return{
        onFetchOrders:()=> dispatch(actions.fetchOrders())
    };
};


export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders,axios));