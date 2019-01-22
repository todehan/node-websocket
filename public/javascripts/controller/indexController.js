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

    function initSocket(username){

        indexFactory.connectSocket("http://localhost:3000", {
        reconnectionAttempts: 3,
        reconnectionDelay: 600        
     }).then((socket) => {
        socket.emit("newUser", {username});

        socket.on("initPlayers", (players) => {
            console.log(players);
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
            $scope.$apply();
        });
     }).catch((err) => {
        console.log("Hata Gerçekleşti", err)
     });
    }

    
}]);