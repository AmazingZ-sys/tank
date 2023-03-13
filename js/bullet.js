
var Bullet = function(context,owner,type,dir){
	this.ctx = context;
	this.x = 0;
	this.y = 0;
	this.owner = owner; //子弹的所属者
	this.type = type;//1、玩家  2、敌方
	this.dir = dir;
	this.speed = 3;
	this.size = 6;
	this.hit = false;
	this.isDestroyed = false;
	
	this.draw = function(){
		this.ctx.drawImage(RESOURCE_IMAGE,POS["bullet"][0]+this.dir*this.size,POS["bullet"][1],this.size,this.size,this.x,this.y,this.size,this.size);
		this.move();
	};
	
	// console.log(owner, dir, type)
	if(type === 1){
		// console.log('玩家射击',owner, dir, type)
	}
	this.move = function(){
		if(this.dir == UP){
			this.y -= this.speed;
		}else if(this.dir == DOWN){
			this.y += this.speed;
		}else if(this.dir == RIGHT){
			this.x += this.speed;
		}else if(this.dir == LEFT){
			this.x -= this.speed;
		}
		
		this.isHit();
	};
	
	/**
	 * 碰撞检测
	 */
	this.isHit = function(){
		// if(this.type === 1 || this.type === 3){
		// 	console.log('玩家射击')
		// }
		if(this.isDestroyed){
			return;
		}
		//临界检测
		if(this.x < map.offsetX){
			this.x = map.offsetX;
			this.hit = true;
		}else if(this.x > map.offsetX + map.mapWidth - this.size){
			this.x = map.offsetX + map.mapWidth - this.size;
			this.hit = true;
		}
		if(this.y < map.offsetY){
			this.y = map.offsetY;
			this.hit = true;
		}else if(this.y > map.offsetY + map.mapHeight - this.size){
			this.y = map.offsetY + map.mapHeight - this.size;
			this.hit = true;
		}
		//子弹是否碰撞了其他子弹
		if(!this.hit){
			if(bulletArray != null && bulletArray.length > 0){
				for(var i=0;i<bulletArray.length;i++){
					if(bulletArray[i] != this && this.owner.isAI != bulletArray[i].owner.isAI && bulletArray[i].hit == false && CheckIntersect(bulletArray[i],this,0)){
						this.hit = true;
						bulletArray[i].hit = true;
						break;
					}
				}
			}
		}
		
		if(!this.hit){
			//地图检测
			if(bulletMapCollision(this,map)){
				this.hit = true;
			}
			//是否击中坦克
			if(this.type == BULLET_TYPE_PLAYER || this.type == BULLET_TYPE_PLAYER2 ){
				// console.log(1111, this.type, BULLET_TYPE_PLAYER, BULLET_TYPE_ENEMY)
				// 自己发射子弹
				if(enemyArray != null || enemyArray.length > 0){
					for(var i=0;i<enemyArray.length;i++){
						var enemyObj = enemyArray[i];
						// 是否击中电脑
						if(!enemyObj.isDestroyed && CheckIntersect(this,enemyObj,0)){
							CheckIntersect(this,enemyObj,0);
							if(enemyObj.lives > 1){
								enemyObj.lives --;
							}else{
								enemyObj.distroy();
							}
							this.hit = true;
							break;
						}
						// console.log(111, player1.lives > 0 && CheckIntersect(this,player1,0), player2.lives > 0 && CheckIntersect(this,player2,0))
						// 是否击中自己人
						if(player1.lives > 0 && CheckIntersect(this,player1,0)){
							if(!player1.isProtected && !player1.isDestroyed){
								player1.distroy();
							}
							this.hit = true;
						}else if(player2.lives > 0 && CheckIntersect(this,player2,0)){
							if(!player2.isProtected && !player2.isDestroyed){
								player2.distroy();
							}
							this.hit = true;
						}
					}
				}
			}else if(this.type == BULLET_TYPE_ENEMY){
				// 机器人发射子弹
				if(player1.lives > 0 && CheckIntersect(this,player1,0)){
					if(!player1.isProtected && !player1.isDestroyed){
						player1.distroy();
					}
					this.hit = true;
				}else if(player2.lives > 0 && CheckIntersect(this,player2,0)){
					if(!player2.isProtected && !player2.isDestroyed){
						player2.distroy();
					}
					this.hit = true;
				}
			}
		}
		
		
		if(this.hit){
			this.distroy();
		}
	};
	
	/**
	 * 销毁
	 */
	this.distroy = function(){
		this.isDestroyed = true;
		crackArray.push(new CrackAnimation(CRACK_TYPE_BULLET,this.ctx,this));
		if(!this.owner.isAI){
			BULLET_DESTROY_AUDIO.play();
		}
	};
	
	
};