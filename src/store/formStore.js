import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";



/**
 * Creates a Zustand store to handle user actions and state updates.
 */
const formStore = create((set, get) => ({


  getSpecificUserLoader: false,
  payload: null,
  usersData: [],
  selectedUser: null,
  updatedUser: null,
  totalData: 0,
  formLoader: false,
  user: null,
  error: null,


  /**
   * Fetches specific user details from API.
   * @param {string} userId - User's unique identifier.
   * @return {Promise<Object>} API response.
   */
  async getSpecificUserData(userId) {
    set({
      getSpecificUserLoader: true,
    });
    try {
      const response = await axios
        .get(`https://crud-vip.vercel.app/api/users/${userId}`)
        .catch(function (error) {
          console.log(error.response.data);
        });

      set({
        selectedUser: response.data.data,
        getSpecificUserLoader: false,
      });
      return response;
    } catch (error) {
      set({ getSpecificUserLoader: false });
      toast.error("Unable to fetch user data");
    }
  },

  /**
   * Sends user data to API for creation.
   * @param {Object} formData - User data.
   * @return {Promise<Object>} API response.
   */
  async postUserData(formData) {
    set({ formLoader: true });

    try {
      const response = await axios.post(
        `https://crud-vip.vercel.app/api/users`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set((state) => ({
        formLoader: false,
        totalData: get().totalData + 1,
        usersData: [response.data.data, ...get().usersData],
      }));

      toast.success("User created.");

      return response;
    } catch (error) {
      set({
        formLoader: false,
      });
      toast.error("Creation of user failed!");
    }
  },

  /**
   * Updates user details in the API.
   * @param {Object} payload - Contains user ID and updated data.
   * @return {Promise<Object>} API response.
   */
  async updateUserData(payload) {
    set({ formLoader: true });

    try {
      const response = await axios.put(
        `https://crud-vip.vercel.app/api/users/${payload.id}`,
        payload.formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response?.data?.data;
      const currentUsers = get().usersData;

      const updatedUsersData = currentUsers.map((user) =>
        user._id === payload.id ? updatedUser : user
      );

      set({
        formLoader: false,
        usersData: updatedUsersData,
      });

      toast.success("User updated.");
      return response;
    } catch (error) {
      console.log("Error in updateUserData:", error);
      set({ formLoader: false });
      toast.error("User update failed!");
    }
  },


  /**
   * Updates a user's status in the API and local state.
   *
   * @param {Object} payload - Contains user ID and new status.
   * @returns {Promise<Object>} API response.
   */
  async updateStatus(payload) {
    

    try {
      const response = await axios.patch(
         `${process.env.API}/users/${payload.id}/status`,
        { status: payload.newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const currentUsers = get().usersData;

      const updatedUsersData = currentUsers.map((user) => {
        if (user._id === payload.id) {
          return {
            ...user,
            status: payload.newStatus,
          };
        }

        return user;
      });

      set({
        usersData: updatedUsersData,   
      });
      return response;
    } catch (error) {
      console.log("Error in updateUserData:", error);
   
      toast.error("Status change failed!");
    }
  },
}));

export default formStore;
