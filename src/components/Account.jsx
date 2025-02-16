import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Account({session}){
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar, setAvartar] = useState(null);

    useEffect(() => {
        getProfile();
    }, [session]);

    async function getProfile() {
        try{
            setLoading(true);
            const user = supabase.auth.user();

            const {data,error,status} = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error;
            }
            
            if(data){
                setUsername(data.username);
                setWebsite(data.website);
                setAvartar(data.avatar);
            }
        }
        catch(error){
            alert(error.message);
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
                            disabled
                            id="email"
                            type="text"
                            label="Email"
                            value={session.user.email}
                        />
                        <TextField
                            id="username"
                            type="text"
                            label="Name"
                            value={username || ''}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <TextField
                            id="website"
                            type="webstie"
                            label="Website"
                            value={website || ''}
                            onChange={(event) => setWebsite(event.target.value)}
                        />
                        <Button 
                            variant="contained"
                            onClick={() => { }}
                            >
                                Update
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={() => {supabase.auth.signOut()}}
                            >
                                Sign out
                        </Button>
                    </div>

                </div>
            </div>
            
        </>
    )
}

export default Account;