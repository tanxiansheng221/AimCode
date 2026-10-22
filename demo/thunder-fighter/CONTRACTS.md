# CONTRACTS.md（框架自动生成，禁止手写）

> 每次文件写入/编辑/删除后由 AimCode 框架从真实代码自动登记签名。
> 需要接口时直接读本文件，禁止重读源文件恢复记忆。更新时间: 2026-10-21T02:09:46

## app.js
- app(req,res)
- serveStatic(req,res)
- path
- config
- logger
- authMiddleware
- errorHandler
- rateLimit
- notFound
- routes

## config.js
- path

## events\enemyEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\loadoutEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\notificationEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\pilotEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\reviewEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\runEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\scoreEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## events\waveEvents.js
- on(event,handler)
- emit(event,payload)
- listeners

## lib\auth.js
- hashPassword(password)
- verifyPassword(password,stored)
- generateToken(payload)
- verifyToken(token)
- crypto
- jwt
- config

## lib\bodyParser.js
- jsonBody(req,res,next)
- events: emit=[] on=[data,end]

## lib\dateUtil.js
- nowISO()
- durationSeconds(startISO,endISO)
- formatRelative(iso)

## lib\errors.js
- AppError
- new AppError(status,message,code)
- ValidationError
- new ValidationError(message)
- UnauthorizedError
- new UnauthorizedError(message)
- ForbiddenError
- new ForbiddenError(message)
- NotFoundError
- new NotFoundError(message)
- ConflictError
- new ConflictError(message)
- RateLimitError
- new RateLimitError(message)

## lib\idGen.js
- generateId(prefix='id')
- counter

## lib\jwt.js
- base64UrlEscape(str)
- base64UrlUnescape(str)
- base64UrlEncode(data)
- base64UrlDecode(str)
- sign(payload,secret,options={})
- verify(token,secret)
- crypto

## lib\logger.js
- log(level,message,meta)
- config
- LEVELS
- current

## lib\pagination.js
- paginate(items,page=1,limit=20)

## lib\seed.js
- seedAll()
- fs
- path
- config
- logger
- seedData

## lib\store.js
- readCollection(name)
- writeCollection(name,data)
- findOne(name,predicate)
- findMany(name,predicate)
- insert(name,doc)
- updateOne(name,predicate,updater)
- removeOne(name,predicate)
- clearCache(name)
- fs
- path
- config
- logger
- caches

## lib\validator.js
- isNonEmptyString(v)
- isString(v,min=1,max=256)
- isInt(v,min=-Infinity,max=Infinity)
- isPositiveInt(v)
- isPositive(v)
- isArray(v,minLen=0)
- isObject(v)
- isOneOf(v,arr)
- isEmail(v)

## middleware\auth.js
- isPublic(req)
- authMiddleware(req,res,next)
- PUBLIC_PATHS

## middleware\errorHandler.js
- errorHandler(err,req,res)
- logger

## middleware\notFound.js
- notFound(req,res)

## middleware\rateLimit.js
- rateLimit(req,res,next)
- config
- buckets

## middleware\roleCheck.js
- requireAdmin(req,res,next)

## public\js\api.js
- request(method,path,body)
- setAuth(t,cs)
- clearAuth()
- API

## public\js\entities.js
- makePlayer(x,y)
- makeBullet(x,y,vy,opts)
- makeEnemy(kind,x,y,wave)
- makeParticle(x,y,color)
- makeExplosion(x,y,color,n)
- makeStars(w,h)
- Entities

## public\js\game.js
- reset()
- start()
- showOverlay(name)
- togglePause()
- gameOver()
- updateHud()
- nextWave()
- loop(ts)
- update(dt)
- hit(a,b)
- clamp(v,lo,hi)
- render(dt)
- drawPlayer(p)
- drawEnemy(e)
- Game

## public\js\main.js
- setMsg(text,ok)
- enableStart()
- doAuth(kind)
- autoLogin()
- refreshLeaderboard()
- escapeHtml(s)

## routes\enemyRoutes.js
- enemyRoutes(req,res,ctx,run)

## routes\index.js
- run(handler)
- routes(req,res,next)
- url
- errorHandler
- pilotRoutes
- runRoutes
- enemyRoutes
- waveRoutes
- scoreRoutes
- reviewRoutes
- statsRoutes
- router

## routes\pilotRoutes.js
- pilotRoutes(req,res,ctx,run)

## routes\reviewRoutes.js
- reviewRoutes(req,res,ctx,run)

## routes\runRoutes.js
- runRoutes(req,res,ctx,run)

## routes\scoreRoutes.js
- scoreRoutes(req,res,ctx,run)

## routes\statsRoutes.js
- statsRoutes(req,res,ctx,run)

## routes\waveRoutes.js
- waveRoutes(req,res,ctx,run)

## server.js
- http
- config
- app
- logger
- server

## services\enemyService.js
- list(query)
- get(enemyId)
- create(data)
- update(enemyId,data)
- remove(enemyId)
- store
- V

## services\loadoutService.js
- getLoadout(pilotId)
- updateLoadout(pilotId,data)
- store
- V
- DEFAULT_LOADOUT

## services\pilotService.js
- register(data)
- login(data)
- getProfile(pilotId)
- updateProfile(pilotId,data)
- listPilots()
- deletePilot(pilotId)
- sanitize(pilot)
- store
- V

## services\reviewService.js
- create(pilotId,data)
- list(query)
- getByPilot(pilotId)
- remove(pilotId,reviewId)
- store
- V

## services\runService.js
- startRun(pilotId,data)
- endRun(pilotId,runId,data)
- getRuns(pilotId)
- getRun(pilotId,runId)
- abandonRun(pilotId,runId)
- store
- V
- pilotEvents
- scoreEvents
- notificationEvents
- events: emit=[pilot:updated,score:submitted] on=[]

## services\scoreService.js
- submit(pilotId,data)
- list(query)
- topScores(limit=10)
- getByPilot(pilotId)
- deleteScore(scoreId)
- store
- V

## services\statsService.js
- getStats()
- getLeaderboard()
- getHealth()
- nowISO()
- store

## services\waveService.js
- list(query)
- get(waveId)
- create(data)
- update(waveId,data)
- remove(waveId)
- store
- V

## smoke.js
- check(name,status,expect,extra)
- config
- B
- passed
- results

## validators\enemyValidator.js
- validateCreate(data)
- validateUpdate(data)
- TYPES
- MOVEMENTS

## validators\loadoutValidator.js
- validateUpdate(data)
- WEAPONS
- SPECIALS

## validators\pilotValidator.js
- validateRegister(data)
- validateLogin(data)
- validateUpdate(data)

## validators\reviewValidator.js
- validateCreate(data)

## validators\runValidator.js
- validateStart(data)
- validateEnd(data)

## validators\scoreValidator.js
- validateSubmit(data)

## validators\waveValidator.js
- validateCreate(data)
- validateUpdate(data)
- DIFFICULTIES
