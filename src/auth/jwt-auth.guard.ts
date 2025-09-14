import { 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException,
  Logger 
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name)

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Log authentication attempts
    const request = context.switchToHttp().getRequest()
    
    if (err || !user) {
      this.logger.warn(`Authentication failed for ${request.ip}: ${err?.message || info?.message || 'Invalid token'}`)
      throw err || new UnauthorizedException('Invalid or expired token')
    }

    this.logger.log(`User ${user.email} authenticated successfully`)
    return user
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
