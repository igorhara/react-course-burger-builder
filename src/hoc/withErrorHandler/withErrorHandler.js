import React,{Component} from 'react';
import Aux from "../Aux/Aux";
import Modal from "../../components/ui/Modal/Modal";

const withErrorHandler = (WrappedComponent,axios) => {


    return class extends Component{

        state={
            error:null
        };

        clickHandler=()=>{
            this.setState({error:null});
        };
        componentWillMount() {
            this.requestInterceptor= axios.interceptors.request.use(req=>{
                this.setState({error:null});
                return req;
            });
            this.responseInterceptor= axios.interceptors.response.use(res=>res,error=>{
               this.setState({error:error});
               //return error;
            })
        }


        componentWillUnmount() {
            console.log('will unmount',this.requestInterceptor,this.responseInterceptor);
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }


        render(){
           return(
               <Aux>
                   <Modal show={this.state.error} modalClosed={this.clickHandler}>
                       {this.state.error? this.state.error.message:null}
                   </Modal>
                   <WrappedComponent {...this.props}/>

               </Aux>
           )
       }
    }
};


export default withErrorHandler;