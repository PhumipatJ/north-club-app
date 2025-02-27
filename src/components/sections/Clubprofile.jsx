import { Upload } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../supabaseClient";

const Clubprofile = () => {
  const { clubId } = useParams();
  const [ isChange, setIsChange ] = useState(false);
  const [clubData, setClubData] = useState({
    club_quote: "",
    club_description: [],
    club_avatar: "",
    mail: "",
    instagram: "",
    facebook: ""
  });

  const [clubAvatar, setClubAvatar] = useState(null);
  const [clubAvatarPreview, setClubAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchClubData = async () => {
    const { data, error } = await supabase
        .from("clubs")
        .select("club_quote, club_description, club_avatar, mail, instagram, facebook")
        .eq("club_id", clubId)

      if (error) {
        console.error("Error fetching club data:", error);
      } else {
        setClubData({
          ...data[0],
          club_description: Array.isArray(data[0]?.club_description)
            ? data[0]?.club_description
            : data[0]?.club_description?.split(",") || [], // Convert to array
        });
      }
    };
  
    fetchClubData();
  }, [clubId]);
  
  const handleAvatarFileChange = (e) => {
    setIsChange(true);
    const file = e.target.files[0];
    if (file) {
      setClubAvatarPreview(URL.createObjectURL(file));
      setClubAvatar(file);
    }
  };

  const uploadFile = async (file, bucket) => {
    console.log(file)
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      contentType: file.type,
    });
    
    if (error) {
      console.error(`Upload error (${bucket}):`, error);
      return "";
    }
    return data.path;
  };

  const handleChange = async (e) => {
    setIsChange(true);
    const { name, value } = e.target;
  
    let updatedValue = value;
  
    setClubData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };
  
  const handleConfirm = async () => {
    let avatarUrl = clubData.club_avatar;

    if (clubAvatar) {
      avatarUrl = await uploadFile(clubAvatar, "club-avatars");
    }

    const club_tag = Array.isArray(clubData.club_description)
      ? clubData.club_description
      : clubData.club_description?.split(",").map(tag => tag.trim());

    const { error } = await supabase
      .from("clubs")
      .update({
        club_quote: clubData.club_quote,
        club_description: club_tag,
        club_avatar: avatarUrl,
        mail: clubData.mail,
        instagram: clubData.instagram,
        facebook: clubData.facebook
      })
      .eq("club_id", clubId);

    if (error) {
      console.error("Error updating club:", error);
    } else {
      alert("Club updated successfully!");
    }
  };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full mt-12">
      {/* Profile Picture */}
      <div className="relative flex items-center justify-center">
  {/* Profile Image with Hover Effect */}
    <div className="relative group">
      <img
        src={
          clubAvatarPreview ||
          supabase.storage
            .from("club-avatars")
            .getPublicUrl(clubData?.club_avatar)?.data.publicUrl
        }
        alt="profile"
        className="w-32 h-32 rounded-full border-4 border-white shadow-md transition-opacity duration-300 group-hover:opacity-50"
      />
      {/* Upload Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <label className="cursor-pointer flex items-center justify-center">
          <Upload className="w-10 h-10 text-white bg-[#FF7E69] bg-opacity-50 p-2 rounded-full" />
          <input
            name="club_avatar"
            type="file"
            onChange={handleAvatarFileChange}
            className="hidden"
            required
          />
        </label>
      </div>

    </div>
  </div>


      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Quote */}
        <div className="w-full">
          <label className="block text-gray-700">Quote</label>
          <textarea
            name="club_quote"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            rows="5"
            defaultValue={clubData?.club_quote || ""}
            onChange={handleChange}
          >
          </textarea>
        </div>

        {/* Tags */}
        <div className="w-full">
          <label className="block text-gray-700">Tags (ใช้ "," คั่นระหว่าง tag)</label>
          <textarea
          name="club_description"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            rows="5"
            defaultValue={clubData?.club_description || ""}
            onChange={handleChange}
          >
          </textarea>
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Instagram URL */}
        <div className="w-full">
          <label className="block text-gray-700">Instagram</label>
          <input
            name="instagram"
            type="text"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Enter Instagram Name"
            defaultValue={clubData?.instagram || ""}
            onChange={handleChange}
          />
        </div>

        {/* Facebook URL */}
        <div className="w-full">
          <label className="block text-gray-700">Facebook</label>
          <input
            name="facebook"
            type="text"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Enter Facebook Name"
            defaultValue={clubData?.facebook || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Email Input */}
            <div className="w-full">
                <label className="block text-gray-700">Email</label>
                <input
                    name="mail"
                    type="email"
                    placeholder="example@email.com"
                    className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
                    defaultValue={clubData?.mail || ""}
                    onChange={handleChange}
                />
            </div>

        {/* Buttons */}
            <div className="flex justify-end items-center gap-4">
            <button className="bg-[#7CE9BF] text-white px-4 py-2 rounded-md" onClick={handleConfirm} disabled={!isChange}>Confirm</button>
            </div>
        </div>

    </div>   
    );
};

export default Clubprofile;