import { UNDEFINED } from '../utils/LConstant';
import LGlobal from '../utils/LGlobal';
import LEvent from '../events/LEvent';
class LBox2d {
    constructor(gravity, doSleep, drawScale) {
        let s = this;
        Box2D.Dynamics.b2World.prototype.LAddController = Box2D.Dynamics.b2World.prototype.AddController;
        Box2D.Dynamics.b2World.prototype.AddController = function(c) {
            let l = {}, k;
            for (k in c) {
                l[k] = c[k];
            }
            if (LBox2d) {
                LBox2d.m_controllerList = l;
            }
            return this.LAddController(c);
        };
        let i, j, b = Box2D, d, a = [b.Collision, b.Common, b.Common.Math, b.Dynamics, b.Dynamics.Contacts, b.Dynamics.Controllers, b.Dynamics.Joints, b.Collision.Shapes];
        for (i in a) {
            for (j in a[i]) {
                s[j] = a[i][j];
            }
        }
        if (typeof drawScale === UNDEFINED) {
            drawScale = 30;
        }
        s.stop = false;
        s.drawScale = 30;
        s.selectedBody = null;
        s.mouseJoint = null;
        s.mousePVec = null;
        s.contactListener = null;
        if (typeof gravity === UNDEFINED) {
            gravity = new s.b2Vec2(0, 9.8);
        } else {
            gravity = new s.b2Vec2(gravity[0], gravity[1]);
        }
        if (typeof doSleep === UNDEFINED) {
            doSleep = true;
        }
        s.world = new s.b2World(gravity, doSleep);
        s.removeList = new Array();
        if (LGlobal.traceDebug) {
            d = new s.b2DebugDraw();
            d.SetSprite(LGlobal.canvas);
            d.SetLineThickness(1);
            d.SetFillAlpha(0.5);
            d.SetAlpha(1);
            d.SetDrawScale(s.drawScale);
            d.SetFlags(s.b2DebugDraw.e_shapeBit | s.b2DebugDraw.e_jointBit);
            s.world.SetDebugDraw(d);
        }
        LGlobal.destroy = true;
    }
    setEvent(t_v, f_v) {
        let s = this;
        if (t_v === LEvent.ENTER_FRAME) {
            s.ll_enterFrame = f_v;
            return;
        }
        if (!s.contactListener) {
            s.contactListener = new s.b2ContactListener();
            s.world.SetContactListener(s.contactListener);
        }
        switch (t_v) {
        case LEvent.END_CONTACT:
            s.contactListener.EndContact = f_v;
            break;
        case LEvent.PRE_SOLVE:
            s.contactListener.PreSolve = f_v;
            break;
        case LEvent.POST_SOLVE:
            s.contactListener.PostSolve = f_v;
            break;
        case LEvent.BEGIN_CONTACT:
        default:
            s.contactListener.BeginContact = f_v;
        }
    }
    setWeldJoint(A, B) {
        let s = this;
        let j = new s.b2WeldJointDef();
        j.Initialize(B, A, B.GetWorldCenter());
        return s.world.CreateJoint(j);
    }
    setLineJoint(A, B, vec, t, m) {
        let s = this;
        let wa = new s.b2Vec2(vec[0], vec[1]);
        let j = new s.b2LineJointDef();
        j.Initialize(A, B, B.GetWorldCenter(), wa);
        if (!t) {
            j.enableLimit = false;
        } else {
            j.lowerTranslation = t[0];
            j.upperTranslation = t[1];
            j.enableLimit = true;
        }
        if (!m) {
            j.enableMotor = false;
        } else {
            j.maxMotorForce = m[0];
            j.motorSpeed = m[1];
            j.enableMotor = true;
        }
        return s.world.CreateJoint(j);
    }
    setGearJoint(A, B, ra, r, p) {
        let s = this;
        let j = new s.b2GearJointDef();
        j.joint1 = r;
        j.joint2 = p;
        j.bodyA = A;
        j.bodyB = B;
        j.ratio = ra * s.b2Settings.b2_pi / (300 / s.drawScale);
        return s.world.CreateJoint(j);
    }
    setPrismaticJoint(A, B, vec, t, m) {
        let s = this;
        let wa = new s.b2Vec2(vec[0], vec[1]);
        let j = new s.b2PrismaticJointDef();
        j.Initialize(B, A, B.GetWorldCenter(), wa);
        if (!t) {
            j.enableLimit = false;
        } else {
            j.lowerTranslation = t[0];
            j.upperTranslation = t[1];
            j.enableLimit = true;
        }
        if (!m) {
            j.enableMotor = false;
        } else {
            j.maxMotorForce = m[0];
            j.motorSpeed = m[1];
            j.enableMotor = true;
        }
        return s.world.CreateJoint(j);
    }
    setRevoluteJoint(A, B, a, m) {
        let s = this;
        let j = new s.b2RevoluteJointDef();
        j.Initialize(A, B, B.GetWorldCenter());
        if (!a) {
            j.enableLimit = false;
        } else {
            j.lowerAngle = a[0] * s.b2Settings.b2_pi / 180;
            j.upperAngle = a[1] * s.b2Settings.b2_pi / 180;
            j.enableLimit = true;
        }
        if (!m) {
            j.enableMotor = false;
        } else {
            j.maxMotorTorque = m[0];
            j.motorSpeed = m[1];
            j.enableMotor = true;
        }
        return s.world.CreateJoint(j);
    }
    setDistanceJoint(A, B) {
        let s = this;
        let j = new s.b2DistanceJointDef();
        j.Initialize(A, B, A.GetWorldCenter(), B.GetWorldCenter());
        return s.world.CreateJoint(j);
    }
    setPulleyJoint(A, B, vA, vB, ratio) {
        let s = this;
        let a1 = A.GetWorldCenter();
        let a2 = B.GetWorldCenter();
        let g1 = new s.b2Vec2(a1.x + (vA[0] / s.drawScale), a1.y + (vA[1] / s.drawScale));
        let g2 = new s.b2Vec2(a2.x + (vB[0] / s.drawScale), a2.y + (vB[1] / s.drawScale));
        let j = new s.b2PulleyJointDef();
        j.Initialize(A, B, g1, g2, a1, a2, ratio);
        j.maxLengthA = vA[2] / s.drawScale;
        j.maxLengthB = vB[2] / s.drawScale;
        return s.world.CreateJoint(j);
    }
    addCircle(r, cx, cy, t, d, f, e) {
        let s = this;
        s.bodyDef = new s.b2BodyDef;
        /*动态*/
        s.bodyDef.type = t;
        s.fixDef = new s.b2FixtureDef;
        /*密度*/
        s.fixDef.density = d;
        /*摩擦*/
        s.fixDef.friction = f;
        /*弹力*/
        s.fixDef.restitution = e;
        s.fixDef.shape = new s.b2CircleShape(r);
        s.bodyDef.position.x = cx;
        s.bodyDef.position.y = cy;
        let shape = s.world.CreateBody(s.bodyDef);
        shape.CreateFixture(s.fixDef);
        return shape;
    }
    addPolygon(w, h, cx, cy, type, d, f, e) {
        let s = this;
        s.bodyDef = new s.b2BodyDef;
        /*动态*/
        s.bodyDef.type = type;
        s.fixDef = new s.b2FixtureDef;
        /*密度*/
        s.fixDef.density = d;
        /*摩擦*/
        s.fixDef.friction = f;
        /*弹力*/
        s.fixDef.restitution = e;
        s.fixDef.shape = new s.b2PolygonShape;
        s.fixDef.shape.SetAsBox(w, h);
        s.bodyDef.position.x = cx;
        s.bodyDef.position.y = cy;
        let shape = s.world.CreateBody(s.bodyDef);
        shape.CreateFixture(s.fixDef);
        return shape;
    }
    addVertices(vertices, type, d, f, e) {
        let s = this, i, l;
        s.bodyDef = new s.b2BodyDef;
        /*动态*/
        s.bodyDef.type = type;
        let shape = s.world.CreateBody(s.bodyDef);
        for (i = 0, l = vertices.length; i < l; i++) {
            s.createShapeAsArray(shape, vertices[i], type, d, f, e);
        }
        return shape;
    }
    createShapeAsArray(c, vertices, type, d, f, e) {
        let s = this;
        let shape = new s.b2PolygonShape();
        let sv = s.createVerticesArray(vertices);
        shape.SetAsArray(sv, 0);
        let def = new s.b2FixtureDef();
        def.shape = shape;
        /*密度*/
        def.density = d;
        /*摩擦*/
        def.friction = f;
        /*弹力*/
        def.restitution = e;
        c.CreateFixture(def);
    }
    createVerticesArray(a) {
        let s = this, i, l;
        let v = new Array();
        if (a.length < 3) {
            return v;
        }
        for (i = 0, l = a.length; i < l; i++) {
            v.push(new s.b2Vec2(a[i][0] / s.drawScale, a[i][1] / s.drawScale));
        }
        return v;
    }
    getBodyAtMouse(mouseX, mouseY) {
        let s = this;
        s.mousePVec = new s.b2Vec2(mouseX, mouseY);
        let aabb = new s.b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
        s.selectedBody = null;
        s.world.QueryAABB(s.getBodyCallBack, aabb);
        return s.selectedBody;
    }
    getBodyCallBack(fixture) {
        let s = LGlobal.box2d;
        if (fixture.GetBody().GetType() !== s.b2Body.b2_staticBody) {
            if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), s.mousePVec)) {
                s.selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    ll_show() {
        let s = this, k = null;
        for (k in s.removeList) {
            s.world.DestroyBody(s.removeList[k]);
        }
        s.removeList.splice(0, s.removeList.length);
        if (s.stop) {
            return;
        }
        if (s.ll_enterFrame) {
            s.ll_enterFrame({
                target: s
            });
        }
        s.world.Step(1 / 30, 10, 10);
        s.world.ClearForces();
        if (LGlobal.traceDebug) {
            s.world.DrawDebugData();
        }
    }
    synchronous() {
        let s = this;
        let parent = null, child, position = null, cx = 0, cy = 0, currentBody, joint;
        for (currentBody = s.world.GetBodyList(); currentBody; currentBody = currentBody.GetNext()) {
            child = currentBody.GetUserData();
            if (child) {
                if (!position) {
                    parent = child.parent;
                    cx = currentBody.GetPosition().x;
                    cy = currentBody.GetPosition().y;
                }
                currentBody.SetPosition(new s.b2Vec2((child.x + child.rotatex + parent.x) / s.drawScale, (child.y + child.rotatey + parent.y) / s.drawScale));
                if (!position) {
                    position = {
                        x: (currentBody.GetPosition().x - cx),
                        y: (currentBody.GetPosition().y - cy)
                    };
                }
            }
        }
        for (joint = s.world.GetJointList(); joint; joint = joint.GetNext()) {
            if (joint.m_groundAnchor1) {
                joint.m_groundAnchor1.x += position.x;
                joint.m_groundAnchor1.y += position.y;
            }
            if (joint.m_groundAnchor2) {
                joint.m_groundAnchor2.x += position.x;
                joint.m_groundAnchor2.y += position.y;
            }
        }
        if (LBox2d.m_controllerList && s.world.m_controllerList && parent) {
            LGlobal.box2d.world.m_controllerList.offset = LBox2d.m_controllerList.offset - parent.y / LGlobal.box2d.drawScale;
        }
    }
}
export default LBox2d;