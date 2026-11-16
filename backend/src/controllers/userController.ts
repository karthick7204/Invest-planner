import { user } from '../models/userModel.js'
import {Request , Response} from 'express'
import jwt from 'jsonwebtoken'

export const createuser = async (req :Request ,res : Response)=>{  //user creation function
    try{
      const userdata = new user(req.body)
      const saveduser = await userdata.save()
        console.log("it is wokring")
      if(!saveduser){
      return res.status(404).json({message:"user not found"})
    }
     let token;
     try{
      token=jwt.sign(
         {
           userId: userdata._id,
           email:userdata.email,
         },
         process.env.JWT_SECRET as string,
         
         {expiresIn:"1h"}  
      )
     }catch(err){
      console.log(err);
         return res.status(500).json({message:"Error generating token"})
     }
           return res.status(200).json({message:"logged in sucessfully",
         data: {saveduser,
            token
   }})
    
    } catch (error: any) {
        console.error("Signup error details:", error);
        res.status(500).json({ 
            message: error.message || "internal server error",
            details: error.errors 
        })
    }
}

export const login = async(req :Request,res : Response)=>{ //login function
   try{
     const {username ,email, password} =  req.body
     const userdata  = await user.findOne({username,email,password})

     if(!userdata){
        return res.status(404).json({message:"user not found"})
     }
     let token;
     try{
      token=jwt.sign(
         {
           userId: userdata._id,
           email:userdata.email,
         },
         process.env.JWT_SECRET as string,
         
         {expiresIn:"1h"}
      )
     }catch(err){
      console.log(err);
            const error =
                new Error("Error! Something went wrong.");
     }
     res.status(200).json({message:"logged in sucessfully",
      data: {userdata,
            token
   }})
    
   }
   catch(error: any){
      console.error("usercontroller login error details:", error);
      res.status(500).json({ error: "internal error", message: error?.message || String(error) });
   }
}

export const updateusername = async(req : Request , res : Response)=>{  //update username
    try{
       const  userid  = req.params.id
       const { username }= req.body

       const updateuser = await user.findByIdAndUpdate(userid , {username},{new:true})

       if(!updateuser){
        return res.status(500).send("use not found")
       }
       res.status(200).json({message:"username updated",updateuser})
    }catch(error){
        res.status(500).json({error:"internal error"})

    }
}

export const deleteusername = async(req : Request , res : Response)=>{ // delete username
     try{
       const  userid  = req.params.id
       const userexist  = await user.findByIdAndDelete(userid)
       if(!userexist){
         return res.status(500).json("use not found")
       }
       res.status(200).json({message:"user gets deleted",userexist})

     }catch(error){
        res.status(500).json({error:"internal error"})

     }
}

/**
 * Handle Google OAuth Sign In / Sign Up
 * Verifies Google ID Token via Google tokeninfo API, finds or creates user,
 * and signs an application JWT session.
 */
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== "string") {
      return res.status(400).json({ message: "Google credential token is required" });
    }

    // Verify token with Google's tokeninfo endpoint
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!googleRes.ok) {
      const errData: any = await googleRes.json().catch(() => ({}));
      return res.status(401).json({
        message: "Invalid or expired Google credential token",
        details: errData.error_description || errData.error || "Token verification failed",
      });
    }

    const payload: any = await googleRes.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account did not provide an email address" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let existingUser = await user.findOne({
      $or: [{ email: normalizedEmail }, { googleId }],
    });

    if (existingUser) {
      let shouldSave = false;
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
        shouldSave = true;
      }
      if (picture && !existingUser.avatar) {
        existingUser.avatar = picture;
        shouldSave = true;
      }
      if (shouldSave) {
        await existingUser.save();
      }
    } else {
      // Create new Google-authenticated user
      existingUser = await user.create({
        username: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        authProvider: "google",
        avatar: picture || "",
      });
    }

    // Sign application JWT
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Logged in successfully with Google",
      data: {
        userdata: existingUser,
        token,
      },
    });
  } catch (error: any) {
    console.error("Google auth controller error:", error);
    return res.status(500).json({
      message: "Internal server error during Google authentication",
      error: error?.message || String(error),
    });
  }
};
