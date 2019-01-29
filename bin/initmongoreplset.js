var ism = db.isMaster();
printjson(ism);
if (ism.ismaster) {
   } else 
{
    var msg  = rs.initiate( { _id: "rcreplset", members:[{_id: 0, host: "127.0.0.1:27017"}]});
    printjson(msg);
}
