import { useState } from "react";
import { supabase } from "../supabaseClient";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Auth(){
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (email) => {
        try{
            setLoading(true);
            const {error} = await supabase.auth.signIn({email});
            if(error){
                throw error;
            }
            alert('Check your email for the login link');
        }
        catch(error){
            alert(error.error_description || error.message);
        }
        finally{
            setLoading(false);
        }
        
    }

    return(
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">

                    <div className="block mb-4">
                        <TextField
                            id="outlined-required"
                            type="email"
                            label="Your Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="block mb-4">
                        <Button 
                            variant="contained"
                            onClick={(event) => {
                                event.preventDefault()
                                handleLogin(email)
                            }}
                            disabled={loading}
                            >
                                {loading ? <span>Loading</span> : <span>Send Link</span>}
                            </Button>
                    </div>

                </div>
            </div>
            
        </>
    )
}

export default Auth;