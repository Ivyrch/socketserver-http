
const net = require("net");
const fs = require("fs");



// o cliente é o browser, ele manda um sinal via tcp, o servidor recebe essa informação e tenta interpretar. nesse código aqui a gente faz solicitações via socket e codamos o servidor que se comunica com esse cliente. 


const port = 8002;
const host = "127.0.0.1";

const arquivos = "./arquivos";

const splitando = (splitLine) => {
    var split = splitLine.toString().split(" ");
    let objeto = {
        method: split[0],
        path: split[1],
    };

    return objeto;
};




const server = net.createServer((socket) => {
    console.log(
        `=> (${socket.remoteAddress} : ${socket.remotePort}) se conectou ao servidor!`
    );

    socket.on("data", (data) => {
        var dado = data.toString();
        var objeto = splitando(dado);

        console.log(splitando(dado));
       
                    
       if(dado.startsWith("POST")) {
        fs.appendFile("Fileindex.html", `postado!`, (err)=> {
            if(err) throw err;
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n`)
            console.log('created!');
        })
        }
         else if (!fs.existsSync(arquivos + dado.split(" ")[1])) {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.end();
        } else {
            console.log(dado.split(" ")[1]);
            fs.readFile(arquivos + objeto.path, (err, data) => {
                if (objeto.path == "/") {
                    socket.write("HTTP/1.1 200 OK\r\n\r\n");
                    socket.write("home\r\n");
                    socket.write("Para fazer buscar de algum documento, digite / seguido pelo nome do arquivo e formato.\r\n");
                    socket.write("Para acessar o método POST digite /form.html \r\n");
                } else if (err) {
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                    console.log(err);
                } else {
                    socket.write("HTTP/1.1 200 OK\r\n\r\n");
                    socket.write(data);
                }
                socket.end();
            });
        }



    });

    socket.on("end", () => {
        console.log(
            `=> (${socket.remoteAddress} : ${socket.remotePort}) Encerrou a conexão`
        );
    });
});


server.listen(port, host, () => {
    console.log(`Servidor iniciado em localhost:${port}`);
});