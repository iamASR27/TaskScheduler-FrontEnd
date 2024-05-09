function useFetchData() {
    let url = "https://task-scheduler-8b672-default-rtdb.firebaseio.com";
    const postTask = async (data) => {
      // console.log(data)
      try {
        const res = await fetch(
          `${url}/tasks.json`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error("Error adding task to server");
        }

        const resData = res.json();
        return resData;
      } catch (error) {
        console.error("Error: ", error);
      }
    //   try {
    //     const response = await fetch("http://localhost:3000/api/add-expense", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(data),
    //     });
    //     if (!response.ok) {
    //       throw new Error("Error adding expense");
    //     }
    //     const postData = await response.json();
    //     console.log(postData)
    //     return postData;
    //   } catch (error) {
    //     console.error(error);
    //   }
    };
  
    const getAllTasks = async () => {
        try {
            const res = await fetch(`${url}/tasks.json`);
            if (!res.ok) {
              throw new Error("Failed to get tasks data");
            }
            const resData = await res.json();
    
            const data = [];
            for (let key in resData) {
              data.push({
                id: key,
                ...resData[key],
              });
            }
    
            // setTasks(data);
            // console.log(data)
        
            return data.reverse();
          } catch (error) {
            console.error(error);
          }
    }
  
    const deleteTask = async(id) => {
      try {
        const response = await fetch(`${url}/tasks/${id}.json`,{
          method: 'DELETE'
        })
  
        if(!response.ok) {
          throw new Error("Error deleting expense");
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    const editTask = async(data, id) => {
       try {
        const response = await fetch(`${url}/tasks/${id}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Error adding expense");
        }
        const updateData = await response.json();
        console.log(updateData)
        return updateData;
      } catch (error) {
        console.error(error);
      }
    }
  
    return { postTask, getAllTasks, editTask, deleteTask};
  }
  
  export default useFetchData;