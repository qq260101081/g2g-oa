<h1>Login</h1>


<div class="row">
    <div class="col-lg-5">
        <form name="loginForm" id="login-form" role="form" >
            <div class="form-group field-loginform-username required">
                <label class="control-label" for="loginform-username">Username(demo)</label>
                <input type="text" id="username" class="form-control">
            </div>

            <div class="form-group field-loginform-password required">
                <label class="control-label" for="loginform-password">Password(demo)s</label>
                <input type="password" id="password" class="form-control">
            </div>

            <div class="form-group">
                <button type="button" class="btn btn-primary" id="login" name="login-button">Login</button>
            </div>

        </form>
    </div>
</div>

<script>
window.onload = function(){ 
	$('#login').on('click', function(){
		var username = $('#username').val();
		var password = $('#password').val();
		$.ajax({
			url: '/advanced/api/web/login', //‘› ±–¥À¿
			type: 'GET',
			data: {username:username,password:password},
			success: function(res){
				console.log(res);
			}	
		});
	});
}
</script>
