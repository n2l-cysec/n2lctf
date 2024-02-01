package main

import (
	"fmt"
	"github.com/TwiN/go-color"
	"github.com/elabosak233/pgshub/containers/providers"
	"github.com/elabosak233/pgshub/controllers"
	_ "github.com/elabosak233/pgshub/docs"
	"github.com/elabosak233/pgshub/middlewares"
	"github.com/elabosak233/pgshub/repositories"
	"github.com/elabosak233/pgshub/routers"
	"github.com/elabosak233/pgshub/services"
	"github.com/elabosak233/pgshub/utils/assets"
	"github.com/elabosak233/pgshub/utils/config"
	"github.com/elabosak233/pgshub/utils/convertor"
	"github.com/elabosak233/pgshub/utils/database"
	log "github.com/elabosak233/pgshub/utils/logger"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"net/http"
	"os"
)

var (
	CommitId = ""
	BuildAt  = ""
)

func init() {
	data, _ := assets.ReadStaticFile("banner.txt")
	banner := string(data)
	fmt.Printf("\n%s\n", color.InWhiteOverCyan(banner))
	fmt.Printf("\n%s %s\n", color.InRed("WARNING"), color.InWhiteOverRed("PgsHub is still in development."))
	fmt.Printf("%s %s\n", color.InRed("WARNING"), color.InWhiteOverRed("All features are not guaranteed to work."))
	fmt.Printf("\n%s %s\n", color.Ize(color.Bold, "Commit ID:"), color.Ize(color.Bold, CommitId))
	fmt.Printf("%s %s\n", color.Ize(color.Bold, "Build At:"), color.Ize(color.Bold, BuildAt))
	fmt.Printf("%s %s\n\n", color.Ize(color.Bold, "Issues:"), color.Ize(color.Bold, "https://github.com/elabosak233/PgsHub/issues"))
}

// @title PgsHub Backend API
// @version 1.0
func main() {
	config.InitConfig()
	database.InitDatabase()

	if viper.GetString("container.provider") == "docker" {
		providers.NewDockerProvider()
	}

	// Debug 模式
	if convertor.ToBoolD(os.Getenv("DEBUG"), false) {
		database.GetDatabase().ShowSQL(true)
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	// Cors 配置
	cor := cors.DefaultConfig()
	cor.AllowOrigins = viper.GetStringSlice("server.cors.allow_origins")
	cor.AllowMethods = viper.GetStringSlice("server.cors.allow_methods")
	cor.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "PgsToken"}
	cor.AllowCredentials = true
	r.Use(cors.New(cor))

	// 依赖注入
	appRepository := repositories.InitRepositories(database.GetDatabase())
	appService := services.InitServices(appRepository)
	appMiddleware := middlewares.InitMiddlewares(appService)
	appController := controllers.InitControllers(appService)
	routers.NewRouters(r.Group("/api"), appController, appMiddleware)

	// Swagger 文档
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.NewHandler()))

	// 前端资源
	r.Use(appMiddleware.FrontendMiddleware.Frontend("/", "./dist"))

	s := &http.Server{
		Addr:    viper.GetString("server.host") + ":" + viper.GetString("server.port"),
		Handler: r,
	}
	log.Info("The PgsHub service is launching! Enjoy your hacking challenges!")
	log.Infof("Here's the address! %s:%d", viper.GetString("server.host"), viper.GetInt("server.port"))
	err := s.ListenAndServe()
	if err != nil {
		log.Error("Err... It seems that the port for PgsHub is not available. Plz try again.")
	}
}
