app.controller("indexController", ["$scope", "indexFactory", ($scope, indexFactory) => {
    
    $scope.messages = [];
    $scope.players = {};

    $scope.init = () => {
        const username = prompt("Please enter username");

        if(username){
            initSocket(username);
        }
        else{
            return false;
        }
    };

    function scrollTop (){
        
        setTimeout(() => {
            const element = document.getElementById("chat-area");
            element.scrollTop = element.scrollHeight;

         });
    }

    function initSocket(username){

        indexFactory.connectSocket("http://localhost:3000", {
        reconnectionAttempts: 3,
        reconnectionDelay: 600        
     }).then((socket) => {
        socket.emit("newUser", {username});

        socket.on("initPlayers", (players) => {
            $scope.players = players;
            $scope.$apply();
            
        });

        socket.on("newUser", (data) => {
            const messagesData = {
                type: {
                    code: 0,    
                    message: 1
                },
                username: data.username
            };
            
             $scope.messages.push(messagesData);
             $scope.players[data.id] = data;
             $scope.$apply();
        });
        socket.on("disUser", (data) => {
            const messagesData = {
                type: {
                    code: 0,
                    message: 0
                },
                username: data.username
            };
            console.log(data);
            $scope.messages.push(messagesData);
            delete $scope.players[data.id];
            $scope.$apply();
        });


        socket.on("animate", data => {
            $("#"+ data.socketId).animate({"left": data.x, "top": data.y}, () => {
                animate = false;
            });
        });

        socket.on("newMessage", data => {
            $scope.messages.push(data);
            $scope.$apply();
            scrollTop();
        });


        let animate = false;
        $scope.onClickPlayer = ($event) => {
            
            if (!animate){
                let x = $event.offsetX;
                let y = $event.offsetY;

                socket.emit("animate", { x, y} );
                
                animate = true;
                $("#"+ socket.id).animate({"left": x, "top": y}, () => {
                    animate = false;
                });
            }

        };

        $scope.newMessage = () => {
            let message = $scope.message;

            const messagesData = {
                type: {
                    code: 1
                },
                username: username,
                text: message
            };
            
             $scope.messages.push(messagesData);
             $scope.message = "";

             socket.emit("newMessage", messagesData);

             scrollTop();

             
        };


        }).catch((err) => {
          console.log("Hata Gerçekleşti", err)
        });
    }

    
}]);