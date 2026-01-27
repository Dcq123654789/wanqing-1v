/**
 * 完善信息页面
 * 新用户首次登录后需要填写基本信息
 */
import React, { useState } from "react";
import { View, Text, Input, Button, ScrollView, Image, Picker, RadioGroup, Radio, Label } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useUserStore } from "@/store/userStore";
import { API_BASE_URL, API_ROUTES } from "@/config";
import AddressPicker from "@/pages/joy/components/CommunityActivity/Registration/components/AddressPicker";
import "./index.scss";

interface FormData {
  avatar: string;    // 头像URL
  name: string;      // 真实姓名
  nickname: string;  // 昵称
  phone: string;     // 手机号
  gender: number;    // 性别：0-未知，1-男，2-女
  birthdate: string; // 出生日期 (YYYY-MM-DD)
  address: string;   // 详细地址
  detailAddress: string; // 详细地址（门牌等）
}

interface FormErrors {
  name?: string;
  nickname?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  detailAddress?: string;
  avatar?: string;
}

function CompleteInfo() {
  const { userInfo, updateUserInfo } = useUserStore();
  const [formData, setFormData] = useState<FormData>({
    avatar: userInfo?.avatar || "",
    name: "",
    nickname: "",
    phone: "",
    gender: 0,
    birthdate: "",
    address: "",
    detailAddress: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [addressValue, setAddressValue] = useState<{ province: string; city: string; district: string } | undefined>(undefined);

  // 生成日期选择器数据（多列选择，优化年份滑动）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 99 + i); // 最近100年
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12月
  const currentMonth = new Date().getMonth(); // 0-based
  const currentDay = new Date().getDate();

  // 初始当月的天数，并可随年/月改变
  const initialDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const [days, setDays] = useState<number[]>(Array.from({ length: initialDaysInMonth }, (_, i) => i + 1));

  // 日期选择器的索引，默认定位到当前日期（年份列长，可上下滑动）
  const [datePickerValue, setDatePickerValue] = useState<number[]>(() => {
    const yearIndex = years.length - 1;
    const monthIndex = currentMonth; // 0..11 对应 months 的索引
    const dayIndex = Math.min(currentDay - 1, initialDaysInMonth - 1);
    return [yearIndex, monthIndex, dayIndex];
  });
  const todayStr = new Date().toISOString().slice(0, 10);

  /**
   * 选择头像
   */
  const handleChooseAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        // 显示加载提示
        Taro.showLoading({
          title: "上传中...",
          mask: true,
        });

        // 上传图片到服务器
        Taro.uploadFile({
          url: `${API_BASE_URL}${API_ROUTES.UPLOAD.IMAGE}`,
          filePath: tempFilePath,
          name: "file",
          header: {
            "Authorization": `Bearer ${useUserStore.getState().token}`,
          },
          success: (uploadRes) => {
            Taro.hideLoading();
            const data = JSON.parse(uploadRes.data);
            if (data.code === 200) {
              setFormData((prev) => ({ ...prev, avatar: data.data.url }));
              // 清除错误提示
              if (errors.avatar) {
                setErrors((prev) => ({ ...prev, avatar: undefined }));
              }
              Taro.showToast({
                title: "上传成功",
                icon: "success",
                duration: 1500,
              });
            } else {
              throw new Error(data.message || "上传失败");
            }
          },
          fail: (err) => {
            Taro.hideLoading();
            console.error("头像上传失败:", err);
            Taro.showToast({
              title: "头像上传失败，请重试",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
    });
  };

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证头像
    if (!formData.avatar || formData.avatar.trim() === "") {
      newErrors.avatar = "请上传头像";
    }

    // 验证姓名
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "请输入真实姓名";
    } else if (formData.name.length < 2) {
      newErrors.name = "姓名至少2个字符";
    } else if (formData.name.length > 20) {
      newErrors.name = "姓名最多20个字符";
    }

    // 验证手机号
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "请输入手机号";
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "请输入正确的手机号";
    }

    // 验证昵称（选填，但限制长度）
    if (formData.nickname && formData.nickname.trim().length > 20) {
      newErrors.nickname = "昵称最多20个字符";
    }

    // 验证出生日期（选填，格式 YYYY-MM-DD）
    if (formData.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.birthdate)) {
      newErrors.birthdate = "出生日期格式应为 YYYY-MM-DD";
    }
    // 验证详细地址（选填，长度限制）
    if (formData.detailAddress && formData.detailAddress.trim().length > 255) {
      newErrors.detailAddress = "详细地址最多255个字符";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理输入变化
   */
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误提示
    if ((errors as any)[field]) {
      setErrors((prev) => ({ ...(prev as any), [field]: undefined }));
    }
  };

  /**
   * 选择性别
   */
  const handleSelectGender = (value: string | number) => {
    const gender = typeof value === 'string' ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleAddressChange = (val: { province: string; city: string; district: string }) => {
    setAddressValue(val);
    setFormData((prev) => ({ ...prev, address: `${val.province} ${val.city} ${val.district}` }));
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const handleDateChange = (e: any) => {
    const [yearIndex, monthIndex, dayIndex] = e.detail.value;
    setDatePickerValue([yearIndex, monthIndex, dayIndex]);

    const year = years[yearIndex];
    const month = String(months[monthIndex]).padStart(2, '0');
    const day = String(days[dayIndex]).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    setFormData((prev) => ({ ...prev, birthdate: dateStr }));
    if (errors.birthdate) {
      setErrors((prev) => ({ ...prev, birthdate: undefined }));
    }
  };

  // 当滚动某一列时（尤其是年份列），需要调整月份对应的天数数量
  const handleColumnChange = (e: any) => {
    const { column, value } = e.detail;
    const newValue = [...datePickerValue];
    newValue[column] = value;

    // 如果变更的是年或月，重新计算当月天数并调整 day 索引
    if (column === 0 || column === 1) {
      const year = years[newValue[0]];
      const monthNum = months[newValue[1]]; // 1..12
      const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
      const newDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setDays(newDays);
      if (newValue[2] > daysInMonth - 1) {
        newValue[2] = daysInMonth - 1;
      }
    }

    setDatePickerValue(newValue);
  };

  // 获取显示的日期文本
  const getDisplayDateText = () => {
    if (formData.birthdate) {
      const [year, month, day] = formData.birthdate.split('-');
      return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    }
    return "请选择出生日期 >";
  };

  // 处理详细地址输入变化
  const handleDetailAddressChange = (value: string) => {
    setFormData((prev) => ({ ...prev, detailAddress: value }));
    if ((errors as any).detailAddress) {
      setErrors((prev) => ({ ...(prev as any), detailAddress: undefined }));
    }
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    // 验证表单
    if (!validateForm()) {
      Taro.showToast({
        title: "请检查填写的信息",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    if (!userInfo?._id) {
      Taro.showToast({
        title: "用户信息异常，请重新登录",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    setSubmitting(true);

    try {
      // 调用更新接口
      const payload: any = {
        avatar: formData.avatar,
        // map to backend entity fields
        realName: formData.name.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        // 更新后不再是新用户
        isNewUser: false,
      };

      // 昵称（选填，有值时才添加）
      if (formData.nickname && formData.nickname.trim() !== "") {
        payload.nickname = formData.nickname.trim();
      }

      // 出生日期（选填，有值时才添加，避免 LocalDate 类型转换问题）
      if (formData.birthdate && formData.birthdate.trim() !== "") {
        payload.birthDate = formData.birthdate.trim();
      }

      // 地址信息（选填，有值时才添加）
      if (addressValue?.province) {
        payload.province = addressValue.province;
      }
      if (addressValue?.city) {
        payload.city = addressValue.city;
      }
      if (addressValue?.district) {
        payload.district = addressValue.district;
      }
      if (formData.detailAddress && formData.detailAddress.trim() !== "") {
        payload.detailAddress = formData.detailAddress.trim();
      }

      // include communityId if available from store
      if (userInfo?.communityId) {
        payload.communityId = userInfo.communityId;
      }

      const success = await updateUserInfo(payload);

      if (success) {
        Taro.showToast({
          title: "信息完善成功",
          icon: "success",
          duration: 1500,
        });

        //延迟跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: "/pages/home/index",
          });
        }, 1500);
      } else {
        throw new Error("更新失败");
      }
    } catch (error: any) {
      console.error("完善信息失败:", error);
      Taro.showToast({
        title: error?.message || "完善信息失败，请重试",
        icon: "none",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="complete-info-page"> 
      <ScrollView scrollY className="scroll-container">
        {/* 表单区域 */}
        <View className="form-section">
          {/* 头像上传 */}
          <View className="form-item avatar-item">
            <View className="avatar-label">
              <Text className="label-text">个人头像</Text>
              <Text className="required" aria-label="必填">*</Text>
            </View>
            <View
              className={`avatar-upload ${errors.avatar ? "error" : ""}`}
              onClick={handleChooseAvatar}
              role="button"
              aria-label="上传头像"
              tabIndex={0}
            >
              {formData.avatar ? (
                <Image
                  src={formData.avatar}
                  className="avatar-image"
                  mode="aspectFill"
                  alt="用户头像"
                />
              ) : (
                <View className="avatar-placeholder">
                  {/* 相机图标 已移除 */}
                  <Text className="avatar-text">点击上传头像</Text>
                </View>
              )}
              <View className="avatar-mask">
                <Text className="mask-text">更换头像</Text>
              </View>
            </View>
            {errors.avatar && (
              <Text className="error-text-center" role="alert">{errors.avatar}</Text>
            )}
          </View>

          {/* 真实姓名 */}
          <View className="form-item">
            <View className="form-label">
              <Text className="label-text">真实姓名</Text>
              <Text className="required" aria-label="必填">*</Text>
            </View>
            <Input
              className="form-input"
              placeholder="请输入您的真实姓名"
              value={formData.name}
              onInput={(e) => handleInputChange("name", e.detail.value)}
              maxlength={20}
              aria-label="真实姓名输入框"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <Text className="error-text" id="name-error" role="alert">{errors.name}</Text>}
          </View>

        {/* 昵称（选填） */}
        <View className="form-item">
          <View className="form-label">
            <Text className="label-text">昵称</Text>
            <Text className="optional">（选填）</Text>
          </View>
          <Input
            className="form-input"
            placeholder="请输入昵称（最多20字符）"
            value={formData.nickname}
            onInput={(e) => handleInputChange("nickname", e.detail.value)}
            maxlength={20}
            aria-label="昵称输入框"
            aria-describedby={errors.nickname ? "nickname-error" : undefined}
          />
          {errors.nickname && <Text className="error-text" id="nickname-error">{errors.nickname}</Text>}
        </View>

          {/* 手机号 */}
          <View className="form-item">
            <View className="form-label">
              <Text className="label-text">手机号码</Text>
              <Text className="required" aria-label="必填">*</Text>
            </View>
            <Input
              className="form-input"
              type="tel"
              placeholder="请输入您的手机号"
              value={formData.phone}
              onInput={(e) => handleInputChange("phone", e.detail.value)}
              maxlength={11}
              aria-label="手机号码输入框"
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <Text className="error-text" id="phone-error" role="alert">{errors.phone}</Text>
            )}
          </View>

          {/* 性别 */}
          <View className="form-item">
            <View className="form-label">
              <Text className="label-text">性别</Text>
              <Text className="optional">（选填）</Text>
            </View>
            <RadioGroup
              className="gender-radio-group"
              onChange={(e) => handleSelectGender(e.detail.value)}
            >
              <Label className="gender-radio-label">
                <Radio
                  value="1"
                  checked={formData.gender === 1}
                  className="gender-radio"
                />
                <Text className="radio-text">男</Text>
              </Label>
              <Label className="gender-radio-label">
                <Radio
                  value="2"
                  checked={formData.gender === 2}
                  className="gender-radio"
                />
                <Text className="radio-text">女</Text>
              </Label>
            </RadioGroup>
          </View>
 
        {/* 出生日期（选填） */}
        <View className="form-item">
          <View className="form-label">
            <Text className="label-text">出生日期</Text>
            <Text className="optional">（选填）</Text>
          </View>
          <Picker
            mode="multiSelector"
            range={[years.map((y) => String(y)), months.map((m) => String(m).padStart(2, "0")), days.map((d) => String(d).padStart(2, "0"))]}
            value={datePickerValue}
            onChange={handleDateChange}
            onColumnChange={handleColumnChange}
          >
            <View className={`form-input picker-value ${formData.birthdate ? "picker-value--selected" : ""}`}>
              <Text className="value-text">{getDisplayDateText()}</Text>
              <Text className="picker-arrow">▼</Text>
            </View>
          </Picker>
           
          {errors.birthdate && <Text className="error-text" id="birthdate-error">{errors.birthdate}</Text>}
        </View>

        {/* 所属地区 与 详细地址 */}
          <View className="form-item">
            {/* 所属地区 标题 */}
            <View className="form-label">
              <Text className="label-text">所属地区</Text>
              <Text className="optional">（选填）</Text>
            </View>
            <AddressPicker value={addressValue} onChange={handleAddressChange} />

            {/* 详细地址 标题 */}
            <View className="form-label form-label--sub form-label--spaced">
              <Text className="label-text">详细地址</Text>
              <Text className="optional">（选填）</Text>
            </View>
            <Input
              className="form-input textarea"
              placeholder="请输入详细地址（例如门牌号）"
              value={formData.detailAddress}
              onInput={(e) => handleDetailAddressChange(e.detail.value)}
              maxlength={255}
              aria-label="详细地址输入框"
            />
            {errors.detailAddress && <Text className="error-text" id="detailAddress-error">{errors.detailAddress}</Text>}
          </View>
        </View>

        {/* 温馨提示卡片 */}
        <View className="tips-card">
          <View className="tips-header">
            <Text className="tips-title">温馨提示</Text>
          </View>
          <View className="tips-list">
            <View className="tip-item">
              <View className="tip-bullet"></View>
              <Text className="tips-text">您的手机号将用于接收服务通知和紧急联系</Text>
            </View>
            <View className="tip-item">
              <View className="tip-bullet"></View>
              <Text className="tips-text">信息完善后可在个人中心随时修改</Text>
            </View>
            <View className="tip-item">
              <View className="tip-bullet"></View>
              <Text className="tips-text">我们承诺严格保护您的个人隐私信息</Text>
            </View>
          </View>
        </View>

        {/* 提交按钮 */}
        <View className="submit-section">
          <Button
            className={`submit-button ${submitting ? "submitting" : ""}`}
            onClick={handleSubmit}
            disabled={submitting}
            aria-label="提交信息"
            aria-busy={submitting}
          >
            <Text className="button-text">
              {submitting ? "提交中..." : "完成，开启晚晴生活"}
            </Text>
            {!submitting && (
              <Text className="button-icon">→</Text>
            )}
          </Button> 
        </View>
      </ScrollView>
    </View>
  );
}

export default CompleteInfo;
