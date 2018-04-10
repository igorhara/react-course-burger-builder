import React,{ Component } from 'react';
import Button from "../../../components/ui/Button/Button";
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from "../../../components/ui/Spinner/Spinner";
class ContactData extends Component{
    state={
        name:'',
        email:'',
        address:{
            street:'',
            postalCode:''
        },
        loading:false
    };

    orderHandler = (event)=>{
        event.preventDefault();
       console.log(this.props);
         this.setState({loading:true});
         const order = {
             ingredients:this.props.ingredients,
             price:this.props.price,
             customer:{
                 name:'Igor Hara',
                 address:{
                     street:'IgorStreet 2',
                     zipCode: '2342',
                     country:'Belgium'
                 },
                 email: 'test@test.com'
             },
             deliveryMethod: "fastest"
         };

        axios.post('/orders.json',order)
            .then(response=>{
                this.setState({loading:false});
                this.props.history.push('/')
            })
            .catch(error=>{
                this.setState({loading:false});
            });
    }

    render(){
        let form = (
            <form>
                <input type="text" className={classes.Input} name="email" placeholder="Type email"/>
                <input type="text" className={classes.Input} name="name" placeholder="Your name"/>
                <input type="text" className={classes.Input} name="street" placeholder="Street"/>
                <input type="text" className={classes.Input} name="postalCode" placeholder="Postal code"/>
                <Button btnType="Success" clicked={this.orderHandler}>   ORDER</Button>
            </form>
        );

        if(this.state.loading){
            form = <Spinner/>;
        }

       return(
           <div className={classes.ContactData}>
               <h4>Enter yuor Contact Data</h4>
               {form}
           </div>
       );
    }
}

export default ContactData;
//export default withRouter(ContactData);