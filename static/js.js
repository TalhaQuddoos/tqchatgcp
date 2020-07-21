

function getChats(){
    $.get('/getchats',function(data,status){
        updateChats(JSON.parse(JSON.stringify(data)))
    });
}
function updateChats(data){
    var out = "";
    var abc = Date()

    for(var i = 0; i < data.length; i++){
        diff = data[i].timenow - data[i].lastactive
        out +='<a class="text-reset nav-link p-0 mb-6" href="/t/'+data[i].username+'"><div class="card card-active-listener"><div class="card-body"><div class="media"><div class="avatar avatar-online mr-5"><img class="avatar-img" src="/media/'+data[i].photo+'" alt="Anna Bridges"></div><div class="media-body overflow-hidden"><div class="d-flex align-items-center mb-1"><h6 class="text-truncate mb-0 mr-auto">'+ data[i].firstname + ' ' + data[i].lastname + '</h6><p class="small text-muted text-nowrap ml-4">'+convertTime(new Date(data[i].time).getHours(), new Date(data[i].time).getMinutes() )+'</p></div><div class="text-truncate">'+(data[i].lmby==1?'You: ':data[i].firstname+': ')+data[i].lastmsg+calculateTime(diff)+'</div></div></div></div></div></a>';
    }
    //console.log(out)
    $('#chats').html(out);
}

function getContacts(){
    $.get('/getcontacts',function(data,status){
        updateContacts(JSON.parse(JSON.stringify(data)))
    });
}
function updateContacts(data){
    var out = "";
    var abc = Date()

    for(var i = 0; i < data.length; i++){
        diff = data[i].timenow - data[i].lastactive
        out += `
            <div class="card mb-6">
                <div class="card-body">
                    <div class="media">
                        <div class="avatar avatar-online mr-5">
                            <img class="avatar-img" src="/media/${data[i].photo}" alt="${data[i].name}">
                        </div>
                        <div class="media-body align-self-center">
                            <h6 class="mb-0">${data[i].name}</h6>
                            <small class="text-muted">${(diff<10?'Online':diff<60?`Active a few seconds ago `:diff<3600? `Active ${parseInt(diff/60)}m ago`:diff<86400? `Active ${parseInt(diff/3600)}h ago`:                    `Active ${parseInt(diff/86400)}d ago`)}</small>
                        </div>

                    </div>
                    <a href="/t/${data[i].username}/" class="stretched-link"></a>
                </div>
            </div>
             `
               
    }
    $("#contacts").html(out)
}
getChats();
getContacts();
var a123 = setInterval(getChats, 3000)
var b123 = setInterval(getContacts, 3000)
function getMessages(full){
    $.post('/getmessages/',{
        user: receiver,
        csrfmiddlewaretoken: csrftoken,
        lmi: lmi,
        prevCount: prevCount
    },
    function(data,status){
        if(data.length>0)
        putMessages(JSON.parse(JSON.stringify(data)))
    });
}
getMessages();

function putMessages(data){
    var out = "";
    var settings = []
    var msgContent = ""
    var options = ""
    var t;
    var abc, def;
    if(data[0].lmi>0)
        lmi = data[0].lmi;
    var full = data[0].full;
    $('#main #chat-1 .chat-body .chat-content #_m-cde_fg945fyd___r').remove()
    //alert(full+'    '+data[0].lm+'     '+prevCount)
    //if(data[0].deletedmsgs.length>0){
        $(document).ready(function(){
            for(var k = 0; k < data[0].deletedmsgs.length; k++){
            //console.log(data[0].deletedmsgs)
            $('#main #chat-1 .chat-body .chat-content #_m-cde_fg'+data[0].deletedmsgs[k]+'fyd___r').remove()
            //console.log($('#main #chat-1 .chat-body #abcd').children())
        }
        

        })
    //}
    for(var i = 1; i < data.length; i++){
        if(data[i].msg==='__t__'){

            if(data[i].s==0){
                out += '<div class="message typing"><a class="avatar avatar-sm mr-4 mr-lg-5" href="#" data-chat-sidebar-toggle="#chat-1-user-profile"><img class="avatar-img" src="/media/'+receiverphoto+'" alt=""></a><div class="message-body"><div class="message-row"><div class="d-flex align-items-center"><div class="message-content bg-light"><div><span class="typing-dots" style="font-size: 50px; line-height: 0.2"><span>•</span><span>•</span><span>•</span></span></div></div></div></div></div></div>';
                            continue;
            } 
            continue;
        }
        
        
        if(data[i].s==1){
            settings = ['primary','message-right',false, 'justify-content-end','r','l','text-white',photo]
        } else {
            $('#main #chat-1 #abcd #messages .typing').remove();
            settings = ['light','',true,'','l','r','',receiverphoto]
        }
        out += '<div id="_m-cde_fg'+data[i].id+'fyd___r" class="message  '+settings[1]+'"><div class="avatar avatar-sm m'+settings[5]+'-4 m'+settings[5]+'-lg-5 d-none d-lg-block"><img class="avatar-img" src="/media/'+settings[7]+'" alt=""></div><div class="message-body"><div class="message-row"><div class="d-flex align-items-center '+settings[3]+'">';
        options = '<div class="dropdown"><a class="text-muted opacity-60 m'+settings[4]+'-3" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fe-more-vertical"></i></a><div class="dropdown-menu"><a class="dropdown-item d-flex align-items-center" style="cursor: hand" onclick="deleteForMe(this)">Delete for me<span class="ml-5 fe-trash-2"></span></a>'+(data[i].s==1?'<a class="dropdown-item d-flex align-items-center" style="cursor: hand" onclick="deleteForEveryone(this)">Delete for Everyone<span class="ml-auto fe-trash-2"></span></a>':'')+'</div></div>'
        abc = new Date(data[i].time).getHours();
        def = new Date(data[i].time).getMinutes();
        msgContent = ' <div class="message-content bg-'+settings[0]+' '+settings[6]+'"><div>'+data[i].msg+'</div><div class="mt-1"><small class="opacity-65">'+convertTime(abc,def)+'</small></div></div>';
        if(settings[2]){
            out += msgContent;
            out += options;
            out += '</div></div></div></div>'
        } else {
            out += options;
            out += msgContent;
            out += '</div></div></div></div>'
        }

    }
    //prevCount = data[0].prevCount;
    
    $("#messages").append(out);

    //if(full==true){
    //    $("#messages").html(out)
    //}
    if(data.length>0||data[0].length>0)
        $('#abcd').scrollTop($('#abcd')[0].scrollHeight);


    out = "";
    //alert(lmi)

}
function deleteForEveryone(elem){
    id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.split("")
    var ID = '';
    for(var i = 9; i < id.length - 7; i++){
        ID += id[i]
    }
    $.post('/delete/',{
        id: ID,
        csrfmiddlewaretoken: csrftoken,
        for: 'everyone'
    }, function(data, status){
        if(status=="success"){
           elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        }
    })
}
function deleteForMe(elem){
    id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.split("")
    var ID = '';
    for(var i = 9; i < id.length - 7; i++){
        ID += id[i]
    }
    $.post('/delete/',{
        id: ID,
        csrfmiddlewaretoken: csrftoken,
        for: 'me'
    }, function(data, status){
        if(status=="success"){
           elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        }
    })
}
function online(){
    $.get('/online/')
}
function convertTime(abc, def){
    return (abc<10&&abc>0?'0':'')+(abc==0?'12':abc<=12?abc:abc-12)+':'+(def<10?'0':'')+def+(abc<12?' AM':' PM')
}
function calculateTime(time){
    return (diff<10?'Online':diff<60?`Active a few seconds ago `:diff<3600? `Active ${parseInt(diff/60)}m ago`:diff<86400? `Active ${parseInt(diff/3600)}h ago`:                    `Active ${parseInt(diff/86400)}d ago`)
}


function search(that){
    var out = ''
    if(that.value.length > 0){
        $.post('/searchusers/',{
            search: that.value,
            csrfmiddlewaretoken: csrftoken
        },
            function(data, status){
                if(data.length<1){
                    $("#searchresults").addClass("invisible")
                    return
                }
                for(var i = 0; i < data.length; i++){
                    out += `
                    <div class="card mb-6">
                        <div class="card-body">
                            <div class="media">
                                <div class="avatar avatar-online mr-5">
                                    <img class="avatar-img" src="/media/${data[i].photo}" alt="${data[i].name}">
                                </div>
                                <div class="media-body align-self-center">
                                    <h6 class="mb-0">${data[i].name}</h6>
                                    <small class="text-muted">Online</small>
                                </div>
                                <div class="align-self-center ml-5">
                                    <div class="dropdown z-index-max">
                                        <a href="#" style="cursor: hand" onclick='addContact(this, "${data[i].username}")' class="btn btn-sm btn-ico btn-link text-muted w-auto">
                                            <i class="fe-user-plus fe-10x"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <a href="/t/${data[i].username}/" class="stretched-link"></a>
                        </div>
                    </div>
                    `
                }
                //$("#searchresults").css("display","block")
                $("#searchresults").html(out)
                $("#searchresults").removeClass("invisible")
            }
        )
    }
    else{
        $("#searchresults").html("")
        $("#searchresults").addClass("invisible")

    }
}

function addContact(that, username){


    $.post('/addcontact/', {
        'username': username,
        csrfmiddlewaretoken: csrftoken
    },
    function(data, status){
        if(status == "success"){
            that.parentElement.parentElement.parentElement.parentElement.parentElement.remove()  
        }
    }
    )
}
function getOnlineStatus(){
    $.post('/getonlinestatus/',{
        'receiver':receiver,
        csrfmiddlewaretoken: csrftoken
    },
    function(data, status){
        //document.getElementById('onlinestatus').innerHTML = calculateTime(data).toString()
        //console.log(calculateTime(data))
        var diff = data;
        $("#onlinestatus").html((diff<10?'Online':diff<60?`Active a few seconds ago `:diff<3600? `Active ${parseInt(diff/60)}m ago`:diff<86400? `Active ${parseInt(diff/3600)}h ago`:                    `Active ${parseInt(diff/86400)}d ago`))
    }
    )
}





if(receiver.length > 0){
    var abc = setInterval(getMessages,1000, false);
    var xyz = setInterval(getOnlineStatus, 1000)
}
var def = setInterval(online, 5000)
$('#abcd').scrollTop($('#abcd')[0].scrollHeight);


